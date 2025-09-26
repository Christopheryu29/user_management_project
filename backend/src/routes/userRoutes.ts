import express, { Request, Response } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import User, { IUser } from "../models/User";
import cloudinary from "../config/cloudinary";
import logger from "../utils/logger";
import { validateUser, handleValidationErrors } from "../middleware/validation";
import { strictLimiter } from "../middleware/security";
import { cacheMiddleware, invalidateCache } from "../middleware/cache";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_management",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  } as any,
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users with pagination and search
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 6
 *         description: Number of users per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name, occupation, or phone
 *     responses:
 *       200:
 *         description: List of users with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 total:
 *                   type: integer
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", cacheMiddleware(300), async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const search = (req.query.search as string) || "";

    const skip = (page - 1) * limit;

    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { occupation: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      };
    }

    const users = await User.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(searchQuery);

    const response = {
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      timestamp: new Date().toISOString(),
    };

    logger.info(`Users fetched successfully: ${users.length} users`, {
      page,
      limit,
      search,
      total,
      ip: req.ip,
    });

    res.json(response);
  } catch (error) {
    logger.error("Error fetching users:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      query: req.query,
      ip: req.ip,
    });

    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/users/:id - Get single user
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - gender
 *               - birthday
 *               - occupation
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *               birthday:
 *                 type: string
 *                 format: date
 *               occupation:
 *                 type: string
 *                 enum: [Student, Engineer, Teacher, Unemployed]
 *               phone:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 15
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       429:
 *         description: Too many requests
 */
router.post(
  "/",
  strictLimiter,
  upload.single("image"),
  validateUser,
  handleValidationErrors,
  invalidateCache("*"),
  async (req: Request, res: Response) => {
    try {
      const { name, gender, birthday, occupation, phone } = req.body;

      logger.info("Creating new user", {
        name,
        gender,
        occupation,
        hasImage: !!req.file,
        ip: req.ip,
      });

      const user = new User({
        name,
        gender,
        birthday: new Date(birthday),
        occupation,
        phone,
        image: req.file ? req.file.path : "",
      });

      const savedUser = await user.save();

      logger.info("User created successfully", {
        userId: savedUser._id,
        name: savedUser.name,
        ip: req.ip,
      });

      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: savedUser,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Error creating user:", {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        body: req.body,
        ip: req.ip,
      });

      // Handle duplicate key error (phone number)
      if (
        error instanceof Error &&
        error.message.includes("duplicate key error")
      ) {
        return res.status(409).json({
          success: false,
          message: "Phone number already exists",
          error: "A user with this phone number already exists",
        });
      }

      res.status(400).json({
        success: false,
        message: "Error creating user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - gender
 *               - birthday
 *               - occupation
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *               birthday:
 *                 type: string
 *                 format: date
 *               occupation:
 *                 type: string
 *                 enum: [Student, Engineer, Teacher, Unemployed]
 *               phone:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 15
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 timestamp:
 *                   type: string
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       409:
 *         description: Phone number already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
// PUT /api/users/:id - Update user
router.put(
  "/:id",
  upload.single("image"),
  validateUser,
  handleValidationErrors,
  invalidateCache("*"),
  async (req: Request, res: Response) => {
    try {
      const { name, gender, birthday, occupation, phone } = req.body;

      logger.info("Updating user", {
        userId: req.params.id,
        name,
        gender,
        occupation,
        hasImage: !!req.file,
        ip: req.ip,
      });

      const updateData: any = {
        name,
        gender,
        birthday: new Date(birthday),
        occupation,
        phone,
      };

      if (req.file) {
        updateData.image = req.file.path;
      }

      const user = await User.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        logger.warn(`User not found for update: ${req.params.id}`);
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      logger.info("User updated successfully", {
        userId: user._id,
        name: user.name,
        ip: req.ip,
      });

      res.json({
        success: true,
        message: "User updated successfully",
        user: user,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Error updating user:", {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        userId: req.params.id,
        body: req.body,
        ip: req.ip,
      });

      // Handle duplicate key error (phone number)
      if (
        error instanceof Error &&
        error.message.includes("duplicate key error")
      ) {
        return res.status(409).json({
          success: false,
          message: "Phone number already exists",
          error: "A user with this phone number already exists",
        });
      }

      res.status(400).json({
        success: false,
        message: "Error updating user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// DELETE /api/users/:id - Delete user
router.delete(
  "/:id",
  invalidateCache("*"),
  async (req: Request, res: Response) => {
    try {
      logger.info(`Delete request for user ID: ${req.params.id}`, {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      });

      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        logger.warn(`User not found for deletion: ${req.params.id}`);
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      logger.info(`User deleted successfully: ${req.params.id}`);
      res.json({
        success: true,
        message: "User deleted successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Error deleting user:", {
        error: error instanceof Error ? error.message : "Unknown error",
        userId: req.params.id,
        ip: req.ip,
      });

      res.status(500).json({
        success: false,
        message: "Error deleting user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

export default router;
