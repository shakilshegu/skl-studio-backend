import Profile from "../../models/user/profile.model.js";
import userModel from "../../models/user.model.js";
import { Types } from "mongoose";
import { uploadFile } from "../../utils/media.helper.js";
export const getUserProfile = async (req, res) => {
  try {
    const userid = new Types.ObjectId(req.user._id);
    const user = await Profile.findOne({ userId: userid })?.populate("userId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id
    const { firstName, lastName, gender, dateOfBirth } = req.body;

    const file = req.file;
    let photoUrl;

    if (file) {
      photoUrl = await uploadFile(
        file,
        `profile-photos/${userId}/${file.filename}`
      );
    }

    const updateData = {
      firstName,
      lastName,
      gender,
      dateOfBirth,
    };

    if (photoUrl) {
      updateData.profilePhoto = photoUrl;
    }

    const updatedUser = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
     const name = firstName + " " + lastName;
    const userData = await userModel.findOneAndUpdate(userId, {
      name: name,
    });
    return res.status(201).json({ success: true, data: userData });
  } catch (err) {
    console.error("Error updating user profile:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await Profile.findByIdAndDelete(req.user._id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const createProfile = async (req, res) => {
  console.log(req.body);
  try {
    const userId = req.user._id;
    const { firstName, lastName, gender, dateOfBirth, profilePhoto } = req.body;
    console.log("data fetched", dateOfBirth);

    const profileExists = await Profile.findOne({ userId: userId });
    // console.log("profile",profileExists)
    if (profileExists) {
      return res
        .status(400)
        .json({ message: "Profile already exists for this user." });
    }

    const file = req.file;
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Photo required",
      });
    }
    const photoUrl = await uploadFile(
      file,
      `profile-photos/${userId}/${file.filename}`
    );
    // console.log("profile check done")

    const newProfile = new Profile({
      userId: userId,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      profilePhoto: photoUrl,
    });

    const profileData = await newProfile.save();
    const name = firstName + " " + lastName;
    const userData = await userModel.findOneAndUpdate(userId, {
      profile: profileData._id,
      name: name,
    });
    return res.status(201).json({ success: true, data: userData });
  } catch (error) {
    console.error("Error creating profile:", error);
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
