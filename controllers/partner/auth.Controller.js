import OtpModel from '../../models/authModel.js'
import otpGenerator from 'otp-generator';
import Partner from '../../models/partner/partner.Model.js'
import jwt from "jsonwebtoken"
import { sendOTPMessage } from '../../services/authService.js';
import User from '../../models/userModel.js';
import BusinessProfile from '../../models/partner/businessInfo.model.js';

const sendOtpPartnerHandler = async (req, res) => {
    try {
        console.log("HelloMan")
        const { mobileNumber } = req.body
        // Generate a 4-digit numeric OTP
        const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        const currentDate = new Date()
        await OtpModel.findOneAndUpdate(
            { mobileNumber },
            { otpCode: otp, otpExpiration: new Date(currentDate.getTime()) },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )
        // Send OTP via SMS
        await sendOTPMessage(mobileNumber, otp);
        return res.status(200).json({
            success: true,
            msg: "OTP Send successFully"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const verifyOtpPartnerHandler = async (req, res) => {
    try {

        const { mobileNumber, otpCode } = req.body;

        // Validate input
        if (!mobileNumber || !otpCode) {
            return res.status(400).json({
                success: false,
                msg: "Mobile number and OTP code are required",
            });
        }

        // Find the OTP record for the given mobile number
        const otpRecord = await OtpModel.findOne({ mobileNumber });

        if (!otpRecord) {
            return res.status(404).json({
                success: false,
                msg: "Mobile number not found",
            });
        }

        // Check if the OTP matches and is still valid
        const currentTime = new Date();
        if (
            otpRecord.otpCode !== otpCode ||
            new Date(otpRecord.expiryTime) < currentTime // Ensure OTP is not expired
        ) {
            return res.status(400).json({
                success: false,
                msg: "Invalid or expired OTP",
            });
        }

        // Find or create partner

        let user = await User.findOne({ mobile: mobileNumber });
        if (user) {
            if (!user.roles.includes('Studio Owner')) {
                user.roles.push('Studio Owner');
            }
            user.isVerified = true;
        } else {
            user = new User({
                mobile: mobileNumber,
                roles: ['Studio Owner'],
                isVerified: true,
            });
        }

        await user.save();
        let isBusinessUser = false;
        const businessUser = await BusinessProfile.findOne({ user: user._id });
        if (businessUser) {
          isBusinessUser = true;
        }
    
        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                mobileNumber: user.mobileNumber,
                currentRole: 'Studio Owner'
            },
            process.env.JWT_SECRET,
            { expiresIn: '500h' }
        );
        // Remove password from user object
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        // Respond with success
        return res.status(200).json({
            success: true,
            msg: "OTP verified successfully",
            token,
            user: userWithoutPassword,
            isBusinessUser
        });
    } catch (error) {
        console.error("Verify OTP Partner Handler Error:", error);
        return res.status(500).json({
            success: false,
            msg: "An error occurred during OTP verification",
        });
    }
};

export {
    sendOtpPartnerHandler,
    verifyOtpPartnerHandler
}

