import EventCategory from "../../models/admin/eventCategory.model.js";
import PackageModel from "../../models/admin/package.model.js";

export const getEventCategories = async (req, res) => {
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


export const getAllPackages = async (req, res) => {
  try {
    const packages = await PackageModel.find({ isDeleted: false }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};