// controllers/studioCategoryController.js
import StudioCategory from "../../models/admin/studioCategory.model.js";
import { uploadFile, deleteS3File } from "../../utils/media.helper.js";

export const createStudioCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    if (!name || !file) {
      return res.status(400).json({ message: "Name and image are required" });
    }
    const studioCategory = new StudioCategory({
      name,
      imageUrl: "placeholder",
    });
    await studioCategory.save();

    const imageUrl = await uploadFile(
      file,
      `studio-categories/${studioCategory._id}/${file.originalname}`
    );

    if (!imageUrl) {
      await StudioCategory.findByIdAndDelete(studioCategory._id);
      return res.status(500).json({ message: "Failed to upload image" });
    }
    studioCategory.imageUrl = imageUrl;
    await studioCategory.save();

    res.status(201).json(studioCategory);
  } catch (error) {
    console.error("Error creating studio category:", error);
    res
      .status(500)
      .json({
        message: "Failed to create studio category",
        error: error.message,
      });
  }
};

// get all studio categories

export const getAllStudioCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    const totalCount = await StudioCategory.countDocuments(query);
    const studioCategories = await StudioCategory.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: {
        categories: studioCategories,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNextPage: page * limit < totalCount,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error("Error fetching studio categories:", error);
    res.status(500).json({
      message: "Failed to fetch studio categories",
      error: error.message,
    });
  }
};

export const updateStudioCategory = async (req, res) => {
  try {
    const { name, isActive } = req.body;
    const file = req.file;

    const studioCategory = await StudioCategory.findById(req.params.id);

    if (!studioCategory) {
      return res.status(404).json({ message: "Studio category not found" });
    }

    // Update fields if provided
    if (name) studioCategory.name = name;
    if (isActive !== undefined) studioCategory.isActive = isActive === "true";
    if (file) {
      if (
        studioCategory.imageUrl &&
        studioCategory.imageUrl !== "placeholder"
      ) {
        try {
          await deleteS3File(studioCategory.imageUrl);
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
      const imageUrl = await uploadFile(
        file,
        `studio-categories/${studioCategory._id}/${file.originalname}`
      );

      if (imageUrl) {
        studioCategory.imageUrl = imageUrl;
      }
    }

    await studioCategory.save();

    res.status(200).json(studioCategory);
  } catch (error) {
    console.error("Error updating studio category:", error);
    res
      .status(500)
      .json({
        message: "Failed to update studio category",
        error: error.message,
      });
  }
};

export const deleteStudioCategory = async (req, res) => {
  try {
    const studioCategory = await StudioCategory.findById(req.params.id);

    if (!studioCategory) {
      return res.status(404).json({ message: "Studio category not found" });
    }
    if (studioCategory.imageUrl && studioCategory.imageUrl !== "placeholder") {
      try {
        await deleteS3File(studioCategory.imageUrl);
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }

    await StudioCategory.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Studio category deleted successfully" });
  } catch (error) {
    console.error("Error deleting studio category:", error);
    res
      .status(500)
      .json({
        message: "Failed to delete studio category",
        error: error.message,
      });
  }
};
