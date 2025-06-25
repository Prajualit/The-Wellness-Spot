import express, { urlencoded } from "express";
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
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
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
