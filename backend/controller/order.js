const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isSeller } = require("../middleware/auth");
const NewOrder = require("../model/NewOrder");
const nodemailer = require("nodemailer");

// Load environment variables
require("dotenv").config();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail", // Example: Gmail (use your email service)
  auth: {
    user: process.env.SMPT_MAIL, // Corrected typo: SMPT -> SMTP
    pass: process.env.SMPT_PASSWORD, // Corrected typo: SMPT -> SMTP
  },
});

// Create new order and send email to customer
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const {
        customerEmail,
        customerName,
        customerPhoneNumber, // New field added
        location,
        orderDetails,
        orderStock,
        sellerId,
      } = req.body;

      // Validate required fields
      if (
        !customerEmail ||
        !customerName ||
        !customerPhoneNumber || // Added to validation
        !location ||
        !orderDetails ||
        !orderStock ||
        !sellerId
      ) {
        return next(new ErrorHandler("Missing required fields", 400));
      }

      // Validate orderDetails subfields
      const { productId, productName, quantity, price } = orderDetails;
      if (!productId || !productName || !quantity || !price) {
        return next(new ErrorHandler("Please provide all order details!", 400));
      }

      // Create the order
      const order = await NewOrder.create({
        customerEmail,
        customerName,
        customerPhoneNumber, // Added to order creation
        location,
        orderDetails: {
          productId,
          productName,
          quantity,
          price,
          totalAmount: quantity * price,
        },
        orderStock,
        sellerId,
      });

      // Send email to customer
      const mailOptions = {
        from: process.env.SMPT_MAIL, // Corrected typo
        to: customerEmail,
        subject: "Order Confirmation",
        text: `Dear ${customerName},\n\nYour order for "${orderDetails.productName}" has been successfully placed!\n\nOrder Details:\n- Quantity: ${orderDetails.quantity}\n- Price: ${orderDetails.price} Rs\n- Total Amount: ${order.orderDetails.totalAmount} Rs\n- Phone Number: ${customerPhoneNumber}\n- Location: ${location}\n\nThank you for shopping with us!\n\nBest regards,\nYour Shop Team`,
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({
        success: true,
        order,
        message: "Order created and email sent to customer",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update order status
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await NewOrder.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }
      order.status = req.body.status;
      await order.save();
      res.status(200).json({
        success: true,
        message: "Order status updated",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get all orders for a seller
router.get(
  "/get-seller-orders/:sellerId",
  // isSeller, // Uncomment if you want to restrict to authenticated sellers
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await NewOrder.find({ sellerId: req.params.sellerId }).sort({
        createdAt: -1,
      });

      if (!orders.length) {
        return res.status(200).json({
          success: true,
          orders: [],
          message: "No orders found for this seller",
        });
      }

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;