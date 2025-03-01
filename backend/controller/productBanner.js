const express = require("express");
const ProductBanner = require("../model/productBanner");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { isAuthenticated, isSeller } = require("../middleware/auth");
const router = express.Router();

// Create a new product banner
router.post(
  "/create-product-banner",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const { category, subCategory, banners } = req.body;

    if (!banners || banners.length > 3) {
      return next(new ErrorHandler("You can upload a maximum of 3 images.", 400));
    }

    const productBanner = await ProductBanner.create({ category, subCategory, banners });

    res.status(201).json({
      success: true,
      productBanner,
    });
  })
);

// Get product banners by category and subcategory
router.get(
  "/get-product-banners",
  catchAsyncErrors(async (req, res, next) => {
    const { category, subCategory } = req.query;

    const productBanners = await ProductBanner.find({ category, subCategory });

    res.status(200).json({
      success: true,
      productBanners,
    });
  })
);

module.exports = router;