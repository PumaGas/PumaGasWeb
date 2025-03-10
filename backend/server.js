const app = require("./app");
const connectDatabase = require("./db/Database");
const cloudinary = require("cloudinary");
const bodyParser = require("body-parser");

// Increase payload size limit
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down due to uncaught exception`);
});

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// Connect to database and configure Cloudinary once at startup
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  chunk_size: 10 * 1024 * 1024 // 10MB chunk size for large file uploads
});

// Export the app for Vercel serverless function
module.exports = app;

// Unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down due to unhandled promise rejection`);
  process.exit(1);
});