import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/temp", express.static("temp"));

import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);

export { app };