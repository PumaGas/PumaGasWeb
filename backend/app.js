const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

// Load environment variables in non-production
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
console.log("CORS Origin Set To:", frontendUrl);

// CORS configuration using only the cors package
app.use(
  cors({
    origin: frontendUrl, // https://puma-gas-web.vercel.app in production
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, // Allow cookies and auth headers
  })
);

// Middleware for parsing requests
app.use(express.json({ limit: "50mb" })); // Set JSON payload limit to 50 MB
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Set URL-encoded payload limit to 50 MB
app.use(cookieParser());

// Debug middleware to log request and response headers
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}, Origin: ${req.headers.origin}`);
  const originalSend = res.send;
  res.send = function (body) {
    console.log(`Response Headers for ${req.url}:`, res.getHeaders());
    originalSend.call(this, body);
  };
  next();
});

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service
  auth: {
    user: process.env.SMPT_MAIL, // Your email from .env (unchanged as requested)
    pass: process.env.SMPT_PASSWORD, // Your app password from .env (unchanged as requested)
  },
});

// Root route for testing
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

// Route middleware
app.use("/api/v2/user", user);
app.use("/api/v2/order", order);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/banner", banner);
app.use("/api/v2/product-banner", productBanner);

// Send Email Route
app.post("/api/v2/send-email", async (req, res) => {
  const { name, email, phoneNumber, message } = req.body;

  console.log("Request Body:", req.body); // Log incoming data

  // Validate required fields
  if (!name || !email || !message) {
    console.log("Validation failed: Missing required fields");
    return res.status(400).json({
      success: false,
      message: "Name, email, and message are required fields.",
    });
  }

  const mailOptions = {
    from: email, // Sender's email (user's email)
    to: process.env.SMPT_MAIL, // Your email from .env (unchanged as requested)
    subject: `New Contact Us Message from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
        <div style="text-align: center; padding-bottom: 20px;">
          <h1 style="color: #333; font-size: 24px; margin: 0;">New Contact Us Message</h1>
          <p style="color: #666; font-size: 14px; margin: 5px 0;">Received on ${new Date().toLocaleDateString()}</p>
        </div>
        <div style="background-color: #fff; padding: 20px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <h2 style="color: #2c3e50; font-size: 18px; margin-top: 0;">Sender Details</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #555;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone Number:</td>
              <td style="padding: 8px 0;">${phoneNumber || "Not provided"}</td>
            </tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <h2 style="color: #2c3e50; font-size: 18px;">Message</h2>
          <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0;">${message}</p>
        </div>
        <div style="text-align: center; padding-top: 20px;">
          <p style="color: #888; font-size: 12px; margin: 0;">This email was sent from your website's Contact Us form.</p>
          <p style="color: #888; font-size: 12px; margin: 5px 0;">For inquiries, reply directly to this email or contact <a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a>.</p>
        </div>
      </div>
    `,
  };

  console.log("Mail Options:", mailOptions); // Log mail options

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    res.status(200).json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (error) {
    console.error("Error sending email:", error.message); // Log detailed error
    res.status(500).json({
      success: false,
      message: "Failed to send email. Please try again later.",
      error: error.message, // Include error message for debugging
    });
  }
});

// Error Handling Middleware
app.use(ErrorHandler);

module.exports = app;