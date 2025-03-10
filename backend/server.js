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
  console.log(`shutting down the server for handling uncaught exception`);
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// connect db
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  chunk_size: 6000000 // 6MB chunk size for large file uploads
})



// create server
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on http://10.54.4.220:${process.env.PORT}`
  );
});

// unhandled promise rejection
process.on("unhandledRejection", err => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});