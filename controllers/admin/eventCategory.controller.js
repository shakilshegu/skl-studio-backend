import EventCategory from "../../models/admin/eventCategory.model.js";
import { uploadFile, deleteS3File } from "../../utils/media.helper.js";

export const createEventCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    if (!name || !file) {
      return res.status(400).json({ message: "Name and image are required" });
    }
    const eventCategory = new EventCategory({
      name,
      imageUrl: "placeholder",
    });
    await eventCategory.save();
    const imageUrl = await uploadFile(
      file,
      `event-categories/${eventCategory._id}/${file.originalname}`
    );

    if (!imageUrl) {
      await EventCategory.findByIdAndDelete(eventCategory._id);
      return res.status(500).json({ message: "Failed to upload image" });
    }

    eventCategory.imageUrl = imageUrl;
    await eventCategory.save();

    res.status(201).json(eventCategory);
  } catch (error) {
    console.error("Error creating event category:", error);
    res.status(500).json({
      message: "Failed to create event category",
      error: error.message,
    });
  }
};

export const getAllEventCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    const totalCount = await EventCategory.countDocuments(query);
    const eventCategories = await EventCategory.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: {
        categories: eventCategories,
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


export const updateEventCategory = async (req, res) => {
  try {
    const { name, isActive } = req.body;
    const file = req.file;
    const eventCategory = await EventCategory.findById(req.params.id);
    if (!eventCategory) {
      return res.status(404).json({ message: "Event category not found" });
    }

    if (name) eventCategory.name = name;
    if (isActive !== undefined) eventCategory.isActive = isActive === "true";

    if (file) {
      if (eventCategory.imageUrl && eventCategory.imageUrl !== "placeholder") {
        try {
          await deleteS3File(eventCategory.imageUrl);
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }

      const imageUrl = await uploadFile(
        file,
        `event-categories/${eventCategory._id}/${file.originalname}`
      );

      if (imageUrl) {
        eventCategory.imageUrl = imageUrl;
      }
    }

    await eventCategory.save();

    res.status(200).json(eventCategory);
  } catch (error) {
    console.error("Error updating event category:", error);
    res.status(500).json({
      message: "Failed to update event category",
      error: error.message,
    });
  }
};

export const deleteEventCategory = async (req, res) => {
  try {
    const eventCategory = await EventCategory.findById(req.params.id);

    if (!eventCategory) {
      return res.status(404).json({ message: "Event category not found" });
    }

    if (eventCategory.imageUrl && eventCategory.imageUrl !== "placeholder") {
      try {
        await deleteS3File(eventCategory.imageUrl);
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }

    await EventCategory.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Event category deleted successfully" });
  } catch (error) {
    console.error("Error deleting event category:", error);
    res.status(500).json({
      message: "Failed to delete event category",
      error: error.message,
    });
  }
};
