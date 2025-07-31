import Package from "../../models/partner/package.Model.js";
import { uploadFile } from "../../utils/mediaHelper.js";
import { sendResponse } from "../../utils/responseUtils.js";
import partnerStudios from "../../models/partner/studio.Model.js";

const addPackage = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const file = req.file;

    // 👇 Parse JSON strings to arrays
    const equipments = JSON.parse(req.body.equipments);
    const services = JSON.parse(req.body.services);

    const userId = req.user._id;
    const studio = await partnerStudios.findOne({ "owner.userId": userId });
    if (!studio) {
      return res.status(404).json({
        success: false,
        message: "Studio not found.",
      });
    }

    const photoUrl = await uploadFile(file, `package/${file.filename}`);
    
    const newPackage = new Package({
      name,
      price,
      description,
      studioId: studio._id,
      equipments,  // now correctly parsed
      photo: photoUrl,
      services,    // now correctly parsed
    });

    const savedPackage = await newPackage.save();
    return sendResponse(res, true, "Package added successfully.", savedPackage);
  } catch (error) {
    console.error(error.message);
    return sendResponse(
      res,
      false,
      "Error adding package",
      null,
      error.message
    );
  }
};


// Fetch a package by its ID
const getPackageById = async (req, res) => {
  try {
    const packageId = req.params.id; // Get the package ID from the request params
    const packageData = await Package.findOne({
      _id: packageId,
      isDeleted: false,
    })
      .populate("equipments")
      .populate("services");

    if (!packageData) {
      return res.status(404).json({ message: "Package not found." });
    }

    return sendResponse(
      res,
      true,
      "Package retrieved successfully.",
      packageData
    );
  } catch (error) {
    console.error(error.message);
    return sendResponse(
      res,
      false,
      "Error fetching package by ID",
      null,
      error.message
    );
  }
};

const updatePackage = async (req, res) => {
  try {
    const packageId = req.params.id; // Get the package ID from the request params
    const { name, price, description, duration, equipments, services } =
      req.body; // Extract details from the request body
    const file = req.file; // Get the file if uploaded

    // Ensure the package exists
    let existingPackage = await Package.findById(packageId);
    if (!existingPackage) {
      return res.status(404).json({ message: "Package not found." });
    }

    // Update package details
    existingPackage.name = name || existingPackage.name;
    existingPackage.price = price || existingPackage.price;
    existingPackage.description = description || existingPackage.description;
    existingPackage.duration = duration || existingPackage.duration;
    existingPackage.equipments = equipments || existingPackage.equipments;
    existingPackage.services = services || existingPackage.services;

    // If a new file (photo) is uploaded, update it
    if (file) {
      const photoUrl = await uploadFile(file, `package/${file.filename}`);
      existingPackage.photo = photoUrl;
    }

    // Save the updated package
    const updatedPackage = await existingPackage.save();

    return sendResponse(
      res,
      true,
      "Package updated successfully.",
      updatedPackage
    );
  } catch (error) {
    console.error(error.message);
    return sendResponse(
      res,
      false,
      "Error updating package",
      null,
      error.message
    );
  }
};

const deletePackage = async (req, res) => {
  try {
    const packageId = req.params.id; // Get the package ID from the request params

    // Ensure the package exists
    const existingPackage = await Package.findById(packageId);
    if (!existingPackage) {
      return res.status(404).json({ message: "Package not found." });
    }

    // Soft delete the package by setting isDeleted to true
    existingPackage.isDeleted = true;

    // Save the updated package
    await existingPackage.save();

    return sendResponse(res, true, "Package deleted successfully.");
  } catch (error) {
    console.error(error.message);
    return sendResponse(
      res,
      false,
      "Error deleting package",
      null,
      error.message
    );
  }
};

// Fetch all packages for a specific studio
const getAllPackages = async (req, res) => {
  try {
    const { studioId } = req.params; // Get the studio's ID from the request parameters

    if (!studioId) {
      return res.status(400).json({ message: "Studio ID is required." });
    }

    const packages = await Package.find({ studioId, isDeleted: false })
      .populate("equipments")
      .populate("services"); // Retrieve non-deleted packages for the specified studio

    if (packages.length === 0) {
      return res
        .status(404)
        .json({ message: "No packages found for this studio." });
    }

    return sendResponse(
      res,
      true,
      "Packages retrieved successfully.",
      packages
    );
  } catch (error) {
    console.error(error.message);
    return sendResponse(
      res,
      false,
      "Error fetching packages",
      null,
      error.message
    );
  }
};

// Fetch all packages for a specific studio
const getPackagesByStudioId = async (req, res) => {
  try {
    const userId = req.user._id;
    const studio = await partnerStudios.findOne({ "owner.userId": userId });
    if (!studio) {
      return res.status(404).json({
        success: false,
        message: "Studio not found.",
      });
    }
    if (!studio._id) {
      return res.status(400).json({ message: "Studio ID is required." });
    }
    const packages = await Package.find({
      studioId: studio._id,
      isDeleted: false,
    })
      .populate("equipments")
      .populate("services"); // Retrieve non-deleted packages for the specified studio

    if (packages.length === 0) {
      return res
        .status(404)
        .json({ message: "No packages found for this studio." });
    }
    return sendResponse(
      res,
      true,
      "Packages retrieved successfully.",
      packages
    );
  } catch (error) {
    console.error(error.message);
    return sendResponse(
      res,
      false,
      "Error fetching packages",
      null,
      error.message
    );
  }
};

const getPackagesByFilter = async (req, res) => {
  try {
    const { minPrice, maxPrice, ratings } = req.query;

    const query = {};

    // Price filter with validation
    if (minPrice || maxPrice) {
      // Check if both minPrice and maxPrice are provided
      if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
        return res.status(400).json({
          message:
            "Invalid price range: minPrice should be less than or equal to maxPrice.",
        });
      }

      query.price = {}; // Create the filter object only once
      if (minPrice) query.price.$gte = Number(minPrice); // Greater than or equal to minPrice
      if (maxPrice) query.price.$lte = Number(maxPrice); // Less than or equal to maxPrice
    }

    // Ratings filter
    if (ratings) {
      query["reviews.rating"] = { $gte: Number(ratings) }; // Filter for reviews rating greater than or equal to the provided value
    }

    console.log("Query:", query); // Log the final query to debug

    // Fetch the packages from the database
    const packages = await Package.find(query)
      .populate("equipments")
      .populate("services");

    // Send the response
    if (packages.length > 0) {
      res.status(200).json({
        message: "Filtered packages retrieved successfully",
        data: packages,
      });
    } else {
      res.status(200).json({
        message: "No packages found matching the criteria",
        data: [],
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export {
  addPackage,
  getPackagesByFilter,
  deletePackage,
  updatePackage,
  getPackageById,
  getAllPackages,
  getPackagesByStudioId,
};
