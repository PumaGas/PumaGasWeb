const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

// ✅ Fix: Removed extra quotes in CORS configuration
app.use(cors({
  origin: frontendUrl, // Corrected: No extra quotes
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true // Allow cookies and auth headers
}));

// ✅ Fix: Added manual CORS headers middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", frontendUrl);
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.get("/", (req, res) => {
  console.log("API:", frontendUrl);

  res.send(`
    <html>
      <head>
        <title>Environment Variable</title>
      </head>
      <body>
        <h1>Frontend URL:</h1>
        <p>${frontendUrl}</p>
      </body>
    </html>
  `);
});

// Import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");

const order = require("./controller/order");



const banner = require("./controller/banner");
const productBanner = require("./controller/productBanner");

app.use("/api/v2/user", user);


app.use("/api/v2/order", order);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);

app.use("/api/v2/banner", banner);
app.use("/api/v2/product-banner", productBanner);

// Error Handling Middleware
app.use(ErrorHandler);

module.exports = app;
