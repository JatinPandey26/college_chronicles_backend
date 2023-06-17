import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { BlogRouter } from "./Routes/blog.route.js";
import { userRouter } from "./Routes/user.route.js";
import { connect } from "./database.js";
const app = express();

dotenv.config();

// using middlewares
app.use(express.json());
app.use(
 express.urlencoded({
  extended: true,
 })
);
app.use(cookieParser());

app.use(
 cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
 })
);

// Database connection
connect();

cloudinary.v2.config({
 cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
 api_key: process.env.CLOUDINARY_CLIENT_API,
 api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

// Routes
app.use("/api/auth", userRouter);
app.use("/api/blog", BlogRouter);

app.listen(8000, () => {
 console.log("app listening on port 8000");
});
