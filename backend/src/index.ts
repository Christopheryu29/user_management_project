import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import compression from "compression";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

// Import configurations and middleware
import logger from "./utils/logger";
import {
  helmetConfig,
  generalLimiter,
  securityHeaders,
} from "./middleware/security";
import { sanitizeInput } from "./middleware/validation";
import { specs } from "./config/swagger";
import userRoutes from "./routes/userRoutes";

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV || "development";

// Validate required environment variables
if (!MONGODB_URI) {
  logger.error("❌ MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

// Security middleware
app.use(helmetConfig);
app.use(generalLimiter);
app.use(securityHeaders);

// CORS configuration
app.use(
  cors({
    origin:
      NODE_ENV === "production"
        ? process.env.ALLOWED_ORIGINS?.split(",") || []
        : true, // Allow all origins in development
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Accept-Version",
      "Content-Length",
      "Content-MD5",
      "Date",
      "X-Api-Version",
      "sec-ch-ua",
      "sec-ch-ua-mobile",
      "sec-ch-ua-platform",
      "Referer",
      "User-Agent",
    ],
    exposedHeaders: ["X-API-Version", "X-Request-ID"],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

// Manual CORS headers for additional compatibility
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, sec-ch-ua, sec-ch-ua-mobile, sec-ch-ua-platform, Referer, User-Agent"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Compression and parsing middleware
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Input sanitization
app.use(sanitizeInput);

// Logging middleware
app.use(
  morgan("combined", {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

// MongoDB connection with enterprise settings
mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 50, // Maximum number of connections
    minPoolSize: 5, // Minimum number of connections
    maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    bufferCommands: false, // Disable mongoose buffering
  })
  .then(async () => {
    logger.info("✅ Connected to MongoDB successfully");
    logger.info(
      `📄 Database: ${
        mongoose.connection.db?.databaseName || "user_management"
      }`
    );

  })
  .catch((error) => {
    logger.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

// MongoDB connection event listeners
mongoose.connection.on("connected", () => {
  logger.info("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  logger.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  logger.warn("Mongoose disconnected from MongoDB");
});

// Initialize database indexes for performance
mongoose.connection.once("open", async () => {
  try {
    const User = mongoose.model("User");
    await User.collection.createIndex({ name: "text", occupation: "text" });
    await User.collection.createIndex({ createdAt: -1 });
    await User.collection.createIndex({ phone: 1 }, { unique: true });
    logger.info("✅ Database indexes created successfully");
  } catch (error) {
    logger.error("❌ Error creating database indexes:", error);
  }
});

// API Documentation
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "User Management API Documentation",
  })
);

// Enhanced health check endpoint
app.get("/api/health", async (req, res) => {
  const health = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: "1.0.0",
    services: {
      mongodb: {
        status:
          mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
        database: mongoose.connection.db?.databaseName,
      },
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      external: Math.round(process.memoryUsage().external / 1024 / 1024),
    },
  };

  res.json(health);
});

// API routes
app.use("/api/users", userRoutes);

// Global error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.error("Unhandled error:", {
      error: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.status(err.status || 500).json({
      success: false,
      message:
        NODE_ENV === "production" ? "Internal server error" : err.message,
      ...(NODE_ENV !== "production" && { stack: err.stack }),
    });
  }
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    path: req.originalUrl,
  });
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  // Close MongoDB connection
  await mongoose.connection.close();
  logger.info("MongoDB connection closed");

  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`📱 Frontend should connect to: http://localhost:${PORT}`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
  logger.info(`💚 Health Check: http://localhost:${PORT}/api/health`);
});

export default server;
