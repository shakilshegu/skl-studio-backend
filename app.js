import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { swaggerUi, swaggerSpec } from "./swagger.js";
import indexRoutes from "./routes.js";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Error: Missing required environment variable ${varName}`);
    process.exit(1);
  }
});
// Connect to the database
connectDB();
const app = express();

// // Middleware
// // CORS setup
// const allowedOrigins = [
//   "http://localhost:3000",
//   // process.env.FRONTEND_DEV_URL,
//   "http://13.127.106.246:3000",
//   // process.env.FRONTEND_PROD_URL,
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true, // Allow cookies and authorization headers
// }));
// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/api", (req, res) => {
  res.send("API is running...");
});

app.use("/aloka-api", indexRoutes);

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
const PORT = process.env.PORT || 7008;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
