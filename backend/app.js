import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import queryRoutes from "./routes/query.js";
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";
import sendSheetRouter from "./routes/sendsheet.js";
import cron from "node-cron";
import axios from "axios";
import timeout from "connect-timeout";

const app = express();

// Trust proxy for services like Render, Vercel, etc.
app.set('trust proxy', 1);

// Add request timeout middleware (30 seconds)
app.use(timeout('30s'));

// Timeout handler
app.use((req, res, next) => {
  if (!req.timedout) next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        "http://localhost:3000",
        "https://thewellnessspot.vercel.app",
        "https://www.thewellnessspot.vercel.app",
        "https://thewellnessspot.co.in",
        "https://www.thewellnessspot.co.in",
        process.env.CORS_ORIGIN,
        // Add Vercel preview URLs for thewellnessspot
        "https://thewellnessspot-git-main-prajualit.vercel.app",
        "https://thewellnessspot-prajualit.vercel.app"
      ].filter(Boolean); // Remove undefined values
      
      console.log("🌐 CORS: Request from origin:", origin);
      console.log("🌐 CORS: Allowed origins:", allowedOrigins);
      console.log("🌐 CORS: Node env:", process.env.NODE_ENV);
      
      // Check if the origin is allowed
      const isAllowed = allowedOrigins.some(allowed => {
        // Exact match
        if (origin === allowed) return true;
        // Check if it contains the domain (for preview URLs)
        if (process.env.NODE_ENV !== 'production' && origin.includes(allowed.replace('https://', ''))) return true;
        return false;
      });
      
      if (isAllowed) {
        console.log("✅ CORS: Origin allowed");
        callback(null, true);
      } else {
        console.warn("🚫 CORS: Origin not allowed:", origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    preflightContinue: false,
    optionsSuccessStatus: 200
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debug middleware to log all cookies
app.use((req, res, next) => {
  if (req.cookies && Object.keys(req.cookies).length > 0) {
    console.log('🍪 GLOBAL: Cookies received:', Object.keys(req.cookies));
  } else {
    console.log('🍪 GLOBAL: No cookies received for', req.method, req.path);
  }
  next();
});

// Handle preflight requests explicitly
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    "http://localhost:3000",
    "https://thewellnessspot.vercel.app",
    "https://www.thewellnessspot.vercel.app",
    "https://thewellnessspot.co.in",
    "https://www.thewellnessspot.co.in",
    process.env.CORS_ORIGIN,
    // Add Vercel preview URLs for thewellnessspot
    "https://thewellnessspot-git-main-prajualit.vercel.app",
    "https://thewellnessspot-prajualit.vercel.app"
  ].filter(Boolean);

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    return res.sendStatus(200);
  }
  next();
});

app.use("/temp", express.static("temp"));

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  console.log(`🌐 Origin: ${req.headers.origin || 'No origin'}`);
  console.log(`🔧 User-Agent: ${req.headers['user-agent'] || 'No user-agent'}`);
  next();
});

app.use("/api/v1", queryRoutes);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1", sendSheetRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("🚨 Error:", err);
  
  if (req.timedout) {
    return res.status(408).json({
      success: false,
      message: "Request timeout"
    });
  }
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});
// console.log(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

cron.schedule("0 0 * * *", async () => {
  console.log("Cron job executed at", new Date().toLocaleString());
  try {
    await axios.post(`${process.env.SERVER_URL}/api/v1/send-daily-sheet`);
    console.log("Daily sheet email sent!");
  } catch (err) {
    console.error("Failed to send daily sheet email:", err);
  }
});
export { app };
