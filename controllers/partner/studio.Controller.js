import { uploadFile } from "../../utils/media.helper.js";
import { sendResponse } from "../../utils/responseUtils.js";
import Studio from "../../models/partner/studio.model.js";
import User from "../../models/user.model.js";

const fetchStudioById = async (req, res) => {
  try {
    const { id } = req.params;

    const studio = await Studio.findOne({ _id: id, isDeleted: false });

    if (!studio) {
      return res.status(404).json({ message: "Studio not found" });
    }

    return res.json({ success: true, studio });
  } catch (error) {
    console.error("Error fetching studio:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// const fetchStudioByPartnerId = async (req, res) => {
//   try {
//     const  userId  = req.user._id;

//     const studio = await Studio.findOne({ "owner.userId": userId, isDeleted: false });

//     if (!studio) {
//       return res.status(404).json({ success: false, message: "No studios found for this owner." });
//     }

//     return res.status(200).json({
//       success: true,
//       studio
//     });

//   } catch (error) {
//     console.error("Error fetching studios by owner ID:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch studios.",
//     });
//   }
// };



const fetchStudioByPartnerId = async (req, res) => {
  try {
    const userId = req.user._id;

    const studio = await Studio.findOne({ "owner.userId": userId, isDeleted: false }).populate('category');

    return res.status(200).json({
      success: true,
      studio: studio || null,  // return null if not found
      message: studio ? "Studio found" : "No studio found"
    });

  } catch (error) {
    console.error("Error fetching studio by owner ID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch studios",
      error: error.message
    });
  }
};



const addStudioHandler = async (req, res) => {
  try {

    console.log(req.body,"bbbbbbbbb");

    const {
      studioName,
      studioEmail,
      studioMobileNumber,
      studioStartedDate,
      gstNumber,
      addressLineOne,
      addressLineTwo,
      city,
      state,
      pinCode,
      country,
      lat,
      lng,
      studioDescription,
      category,
      ownerName,
      ownerEmail,
      ownerPhoneNumber,
      ownerGender,
      ownerDateOfBirth,
    } = req.body;
    
    const userId = req.user._id;
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if the user already has a studio
    const existingStudio = await Studio.findOne({ owner: userId });
    if (existingStudio) {
      return res.status(400).json({ message: "User already has a studio" });
    }
    const files = req.files;
    const studioLogo = files?.studioLogo?.[0];
    const uploadLogo = await uploadFile(
      studioLogo,
      `studio/${studioLogo.filename}`
    );
    let uploadedPhotos = [];
    if (files?.photos) {
      for (const file of files.photos) {
        const uploadedFilePath = await uploadFile(
          file,
          `studio/${file.filename}`
        );
        uploadedPhotos.push(uploadedFilePath);
      }
    }

    const newStudio = new Studio({
      studioName,
      studioEmail,
      studioLogo: uploadLogo,
      studioMobileNumber,
      studioStartedDate,
      gstNumber,
      category,
      address: {
        addressLineOne,
        addressLineTwo,
        city,
        state,
        pinCode,
        country,
      },
      location: {
        lat,
        lng,
      },
      studioDescription,
      owner: {
        userId: userId,
        name: ownerName,
        email: ownerEmail,
        mobileNumber: ownerPhoneNumber,
        gender: ownerGender,
        dateOfBirth: ownerDateOfBirth,
      },
      images: uploadedPhotos,
      isVerified: false,
    });

    const savedStudio = await newStudio.save();

    return sendResponse(res, true, "Studio created successfully.", savedStudio);
  } catch (error) {
    console.error("Error creating studio:", error);
    return sendResponse(res, false, "Failed to create studio.", error.message);
  }
};
const updateStudioHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      studioName,
      studioEmail,
      studioMobileNumber,
      studioStartedDate,
      gstNumber,
      addressLineOne,
      addressLineTwo,
      city,
      state,
      pinCode,
      country,
      lat,
      lng,
      studioDescription,
      category,
      ownerName,
      ownerEmail,
      ownerPhoneNumber,
      ownerGender,
      ownerDateOfBirth,
    } = req.body;

    const existingStudio = await Studio.findById(id);
    if (!existingStudio) {
      return res.status(404).json({ message: "Studio not found" });
    }

    const files = req.files;
    let studioLogo = existingStudio.studioLogo;
    if (files?.studioLogo?.[0]) {
      studioLogo = await uploadFile(
        files.studioLogo[0],
        `studio/${files.studioLogo[0].filename}`
      );
    }

    let uploadedPhotos = existingStudio.images || [];
    if (files?.photos) {
      uploadedPhotos = [];
      for (const file of files.photos) {
        const uploadedFilePath = await uploadFile(
          file,
          `studio/${file.filename}`
        );
        uploadedPhotos.push(uploadedFilePath);
      }
    }

    const updateData = {
      studioName,
      studioEmail,
      studioLogo,
      studioMobileNumber,
      studioStartedDate,
      gstNumber,
      category,
      address: {
        addressLineOne,
        addressLineTwo,
        city,
        state,
        pinCode,
        country,
      },
      location: {
        lat,
        lng,
      },
      studioDescription,
      owner: {
        userId: existingStudio.owner.userId,
        name: ownerName,
        email: ownerEmail,
        mobileNumber: ownerPhoneNumber,
        gender: ownerGender,
        dateOfBirth: ownerDateOfBirth,
      },
      images: uploadedPhotos,
    };

    const updatedStudio = await Studio.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return sendResponse(
      res,
      true,
      "Studio updated successfully.",
      updatedStudio
    );
  } catch (error) {
    console.error("Error updating studio:", error);
    return sendResponse(res, false, "Failed to update studio.", error.message);
  }
};

const deleteStudioHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const existingStudio = await Studio.findById(id);
    if (!existingStudio) {
      return res.status(404).json({ message: "Studio not found" });
    }

    const updatedStudio = await Studio.findByIdAndUpdate(
      id,
      { isDeleted: true },
      {
        new: true,
      }
    );

    return sendResponse(
      res,
      true,
      "Studio deleted successfully.",
      updatedStudio
    );
  } catch (error) {
    console.error("Error deleting studio:", error);
    return sendResponse(res, false, "Failed to delete studio.", error.message);
  }
};

export {
  fetchStudioById,
  fetchStudioByPartnerId,
  updateStudioHandler,
  addStudioHandler,
  deleteStudioHandler,
};
