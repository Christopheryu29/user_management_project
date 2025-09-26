import express, { Request, Response } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import User, { IUser } from '../models/User';
import cloudinary from '../config/cloudinary';

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_management',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  } as any,
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// GET /api/users - Get all users with pagination and search
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const search = req.query.search as string || '';
    
    const skip = (page - 1) * limit;
    
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { occupation: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const users = await User.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
      
    const total = await User.countDocuments(searchQuery);
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching users', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/users/:id - Get single user
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching user', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/users - Create new user
router.post('/', (req: Request, res: Response, next) => {
  console.log('POST request received');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
}, upload.single('image'), async (req: Request, res: Response) => {
  try {
    console.log('Processing POST request...');
    const { name, gender, birthday, occupation, phone } = req.body;
    
    // Validation
    if (!name || !gender || !birthday || !occupation || !phone) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        received: { name, gender, birthday, occupation, phone } 
      });
    }
    
    const user = new User({
      name,
      gender,
      birthday: new Date(birthday),
      occupation,
      phone,
      image: req.file ? req.file.path : ''
    });
    
    const savedUser = await user.save();
    console.log('User created successfully:', savedUser._id);
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ 
      message: 'Error creating user', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { name, gender, birthday, occupation, phone } = req.body;
    
    const updateData: any = {
      name,
      gender,
      birthday: new Date(birthday),
      occupation,
      phone
    };
    
    if (req.file) {
      updateData.image = req.file.path;
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error updating user', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting user', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;