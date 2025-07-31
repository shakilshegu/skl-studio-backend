import { uploadFile, deleteS3File } from "../../utils/media.helper.js";
import PackageModel from "../../models/admin/package.model.js";

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

export const getPackageById = async (req, res) => {
  try {
    const packages = await PackageModel.findById(req.params.id);

    if (!packages) {
      return res.status(404).json({
        success: false,
        error: "Package not found",
      });
    }

    res.status(200).json({
      success: true,
      data: packages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const createPackage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const draft = await PackageModel.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      photo: "placeholder",
    });

    const photo = await uploadFile(
      file,
      `admin-packages/${draft._id}/${file.originalname}`
    );

    if (!photo) {
      await PackageModel.findByIdAndDelete(draft._id);
      return res.status(500).json({ message: "Failed to upload image" });
    }


    draft.photo = photo;
    await draft.save();

    res.status(201).json({
      success: true,
      data: draft,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ success: false, error: messages });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};


export const updatePackage = async (req, res) => {
  try {
    const packageId = req.params.id;
    const { name, description, price } = req.body;
    const file = req.file;

    const existingPackage = await PackageModel.findById(packageId);

    if (!existingPackage) {
      return res.status(404).json({
        success: false,
        error: "Package not found",
      });
    }

    // Update fields
    if (name) existingPackage.name = name;
    if (description) existingPackage.description = description;
    if (price !== undefined) existingPackage.price = price;

    // Handle S3 image upload
    if (file) {
      // Delete old photo from S3 if exists and not placeholder
      if (existingPackage.photo && existingPackage.photo !== "placeholder") {
        try {
          await deleteS3File(existingPackage.photo);
        } catch (err) {
          console.error("Error deleting old photo:", err);
        }
      }

      // Upload new photo to S3
      const photoUrl = await uploadFile(
        file,
        `packages/${existingPackage._id}/${file.originalname}`
      );

      if (photoUrl) {
        existingPackage.photo = photoUrl;
      }
    }

    await existingPackage.save();

    res.status(200).json({
      success: true,
      data: existingPackage,
    });
  } catch (error) {
    console.error("[UpdatePackage Error]", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


export const deletePackage = async (req, res) => {
  try {
    let packages = await PackageModel.findById(req.params.id);

    if (!packages) {
      return res.status(404).json({
        success: false,
        error: "Package not found",
      });
    }

    // Only admin can delete packages
    // if (req.user.role !== "admin") {
    //   return res.status(401).json({
    //     success: false,
    //     error: "Not authorized to delete this package",
    //   });
    // }

    // Soft delete by setting isDeleted to true
    packages = await PackageModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const hardDeletePackage = async (req, res) => {
  try {
    const packages = await PackageModel.findById(req.params.id);

    if (!packages) {
      return res.status(404).json({
        success: false,
        error: "Package not found",
      });
    }

    // Make sure user has admin rights
    // if (req.user.role !== "admin") {
    //   return res.status(401).json({
    //     success: false,
    //     error: "Not authorized to perform this action",
    //   });
    // }

    await PackageModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const restorePackage = async (req, res) => {
  try {
    let packages = await PackageModel.findById(req.params.id);

    if (!packages) {
      return res.status(404).json({
        success: false,
        error: "Package not found",
      });
    }
    // Only admin can restore packages
    // if (req.user.role !== "admin") {
    //   return res.status(401).json({
    //     success: false,
    //     error: "Not authorized to restore packages",
    //   });
    // }

    packages = await PackageModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: packages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
