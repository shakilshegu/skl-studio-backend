// controllers/portfolioController.js
import Portfolio from "../../models/partner/portfolio.model.js";
import {
  uploadFile,
  deleteFile,
  deleteS3File,
} from "../../utils/media.helper.js";

// Get all portfolios for a user
const getPortfolios = async (req, res) => {
  try {
    const userId = req.user._id;

    const portfolios = await Portfolio.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: portfolios.length,
      data: portfolios,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Get single portfolio
const getPortfolioById = async (req, res) => {
  try {
    const userId = req.user._id;
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: `Portfolio not found with id of ${req.params.id}`,
      });
    }


    res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Create new portfolio
const createPortfolio = async (req, res) => {
  try {
    const userId = req.user._id;

    // Handle file uploads
    const imageUploadPromises = [];
    const files = req.files || [];

    // If there are files to upload
    if (files.length > 0) {
      for (const file of files) {
        // Using your existing S3 upload function
        const uploadPath = `portfolios/${userId}/${file.filename}`;
        imageUploadPromises.push(uploadFile(file, uploadPath));
      }
    }

    // Wait for all uploads to complete
    const imageUrls = await Promise.all(imageUploadPromises);

    // Create portfolio with uploaded images
    const portfolio = await Portfolio.create({
      title: req.body.title,
      category: req.body.category,
      location: req.body.location,
      description: req.body.description,
      images: imageUrls,
      user: userId,
    });

    res.status(201).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    console.error(error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Update portfolio
const updatePortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: `Portfolio not found with id of ${req.params.id}`,
      });
    }

    const imageUploadPromises = [];
    const files = req.files || [];
    let existingImages = [];

    // Handle existing images
    if (req.body.existingImages) {
      const existingImageIds = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];

      // Filter out the images that should be kept
      existingImages = portfolio.images.filter((img) =>
        existingImageIds.includes(img)
      );

      // Delete images that are not in the existingImageIds list
      const imagesToDelete = portfolio.images.filter(
        (img) => !existingImageIds.includes(img)
      );

      // Delete unwanted images from S3
      for (const img of imagesToDelete) {
        await deleteS3File(img);
      }
    } else {
      // If existingImages not specified, keep all existing images
      existingImages = portfolio.images;
    }

    // Upload new images to S3
    if (files.length > 0) {
      for (const file of files) {
        const uploadPath = `portfolios/${req.user._id}/${file.filename}`;
        imageUploadPromises.push(uploadFile(file, uploadPath));
      }

      // Wait for all uploads to complete
      const imageUrls = await Promise.all(imageUploadPromises);

      // Combine existing and new images
      existingImages = [...existingImages, ...imageUrls];
    }

    // Update portfolio data
    portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        category: req.body.category,
        location: req.body.location,
        description: req.body.description,
        images: existingImages,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    console.error(error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Delete portfolio
const deletePortfolio = async (req, res) => {
  try {
    const userId = req.user._id;

    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: `Portfolio not found with id of ${req.params.id}`,
      });
    }

    // Delete all images from S3
    for (const image of portfolio.images) {
      await deleteS3File(image);
    }

    // Remove portfolio from database
    await portfolio.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

export {
  createPortfolio,
  getPortfolioById,
  getPortfolios,
  updatePortfolio,
  deletePortfolio,
};
