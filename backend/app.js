import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import queryRoutes from "./routes/query.js";
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";
import sendSheetRouter from "./routes/sendsheet.js";
import cron from "node-cron";
import axios from "axios";

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        "http://localhost:3000",
        "https://thewellnessspot.vercel.app",
        process.env.CORS_ORIGIN
      ].filter(Boolean); // Remove undefined values
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
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

// Handle preflight requests explicitly
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
});

app.use("/temp", express.static("temp"));

app.use("/api/v1", queryRoutes);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1", sendSheetRouter);
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
