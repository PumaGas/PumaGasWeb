const express = require("express");
const Banner = require("../model/banner");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { isAuthenticated, isSeller } = require("../middleware/auth");
const router = express.Router();

// Update or Create Home Banner
router.post(
    "/update-home-banner",
     isSeller,
    catchAsyncErrors(async (req, res, next) => {
      console.log("Received Data:", req.body); // Debug log
  
      const { images } = req.body;
  if(!images){
    return next(new ErrorHandler("error", 400));
  }
      if (!images || !Array.isArray(images) || images.length > 3) {
        return next(new ErrorHandler("You can upload a maximum of 3 images.", 400));
      }
  
      let banner = await Banner.findOne();
      if (banner) {
        // Fill empty slots with previous images
        const updatedImages = banner.images.slice();
        images.forEach((img, index) => {
          if (img.trim() !== "") updatedImages[index] = img;
        });
  
        banner.images = updatedImages;
        await banner.save();
      } else {
        banner = await Banner.create({ images });
      }
  
      res.status(200).json({
        success: true,
        banner,
        message: "Home banner updated successfully!",
      });
    })
  );
  

// Get the Home Banner
router.get(
  "/get-home-banner",
  catchAsyncErrors(async (req, res, next) => {
    const banner = await Banner.findOne().sort({ createdAt: -1 });

    if (!banner) {
      return next(new ErrorHandler("No home banner found.", 404));
    }

    // Ensure response always contains 3 image slots
    const banners = [
      banner.images[0] || "", 
      banner.images[1] || "", 
      banner.images[2] || ""
    ];

    res.status(200).json({
      success: true,
      banners,
    });
  })
);

module.exports = router;
