import Studio from "../../models/partner/Studio.model.js";

/**
 * @desc    Fetch all studios with pagination, filtering and search
 * @route   GET /api/admin/studios
 * @access  Private/Admin
 */
const fetchAllStudio = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = { };
    
    // Handle isDeleted filter (default: false)
    filter.isDeleted = req.query.isDeleted === 'true' ? true : false;
    
    // Handle isVerified filter
    if (req.query.isVerified !== undefined) {
      filter.isVerified = req.query.isVerified === 'true' ? true : false;
    }
    
    // Handle type filter
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    // Handle search
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { studioName: searchRegex },
        { studioEmail: searchRegex },
        { studioMobileNumber: searchRegex },
        { 'owner.name': searchRegex },
        { 'owner.email': searchRegex },
        { 'address.city': searchRegex },
        { 'address.state': searchRegex },
      ];
    }
    
    // Execute query with pagination
    const studios = await Studio.find(filter)
      .populate('type', 'name') 
      .populate('partner', 'name email') 
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    // Get total count for pagination
    const totalStudios = await Studio.countDocuments(filter);
    
    return res.json({ 
      success: true, 
      studios,
      pagination: {
        page,
        limit,
        totalStudios,
        totalPages: Math.ceil(totalStudios / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching studios:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const approveStudio = async (req, res) => {
  try {
    const studio = await Studio.findById(req.params.id);
    
    if (!studio) {
      return res.status(404).json({ success: false, message: "Studio not found" });
    }
    
    // Update verification status
    studio.isVerified = true;
    
    await studio.save();
    
    return res.json({ 
      success: true, 
      message: "Studio approved successfully",
      studio: {
        _id: studio._id,
        studioName: studio.studioName,
        isVerified: studio.isVerified
      }
    });
  } catch (error) {
    console.error("Error approving studio:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const blockStudio = async (req, res) => {
  try {
    const { reason } = req.body;
    const studio = await Studio.findById(req.params.id);
    
    if (!studio) {
      return res.status(404).json({ success: false, message: "Studio not found" });
    }
    studio.isVerified = false;
    // Optionally store rejection reason in a new field
    // This would require adding a field to the schema
    if (reason) {
      // If you want to store rejection reasons, add a 'rejectionReason' field to the schema
      // studio.rejectionReason = reason;
    }
    
    await studio.save();
    
    return res.json({ 
      success: true, 
      message: "Studio blocked/rejected successfully",
      studio: {
        _id: studio._id,
        studioName: studio.studioName,
        isVerified: studio.isVerified
      }
    });
  } catch (error) {
    console.error("Error blocking studio:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getStudioById = async (req, res) => {
  try {
    const studio = await Studio.findById(req.params.id)
      .populate('type', 'name')
      .populate('partner', 'name email');
    
    if (!studio) {
      return res.status(404).json({ success: false, message: "Studio not found" });
    }
    
    return res.json({ success: true, studio });
  } catch (error) {
    console.error("Error fetching studio details:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { 
  fetchAllStudio,
  approveStudio,
  blockStudio,
  getStudioById
};