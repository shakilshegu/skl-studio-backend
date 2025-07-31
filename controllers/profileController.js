import profileModel from "../models/profileModel.js";
import userModel from "../models/userModel.js";
import { uploadFile } from "../utils/mediaHelper.js";

export const getProfileDetails = async (req, res) => {
    try {
        const userId = req.query.userId;

        // Check if userId is provided
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required',
            });
        }

        // Fetch user details
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Fetch profile details if it exists
        const profile = await profileModel.findOne({ userId });

        // Prepare profile data
        const profileData = {
            userId: user._id,
            email: user.email,
            mobile: user.mobile,
            roles: user.roles,
            isVerified: user.isVerified,
            profile: profile
                ? {
                    firstName: profile.firstName || '',
                    lastName: profile.lastName || '',
                    gender: profile.gender || 'other',
                    dateOfBirth: profile.dateOfBirth || null,
                    profilePhoto: profile.profilePhoto || null,
                }
                : null, // Include null if profile does not exist
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        // Respond with combined user and profile data
        res.status(200).json({
            success: true,
            message: 'Profile details retrieved successfully',
            data: profileData,
        });
    } catch (error) {
        console.error('Error fetching profile details:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};


export const updateProfileDetails = async (req, res) => {
    try {
        // Get userId from authenticated user or body
        const userId = req.body.userId;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const {
            firstName,
            lastName,
            email,
            gender,
            dateOfBirth
        } = req.body;

        // Update user details
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user model fields
        if (email) user.email = email;
        await user.save();

        // Find or create profile
        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            profile = new profileModel({ userId });
        }

        // Update profile fields
        if (firstName) profile.firstName = firstName;
        if (lastName) profile.lastName = lastName;
        if (gender) profile.gender = gender;
        if (dateOfBirth) profile.dateOfBirth = new Date(dateOfBirth);

        // Handle profile photo if present
        if (req.file) {
            const uploadedFilePath = await uploadFile(req.file, `userProfile/${req.file.filename}`);
            profile.profilePhoto = uploadedFilePath;
        }

        await profile.save();

        // Fetch updated user with profile
        const updatedUser = await userModel.findById(userId)
            .select('-password -accessToken')
            .populate('profile');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                userId: updatedUser._id,
                email: updatedUser.email,
                mobile: updatedUser.mobile,
                roles: updatedUser.roles,
                isVerified: updatedUser.isVerified,
                profile: updatedUser.profile,
                updatedAt: updatedUser.updatedAt
            }
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}


