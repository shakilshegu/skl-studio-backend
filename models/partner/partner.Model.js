import mongoose from 'mongoose';

const PartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    otp: {
        type: String,
    },
    newOtp: {
        type: String,
    },
    role: {
        type: String,
        enum: ['' ,'Studio Owner', 'Space Owner', 'Freelancer'],
        default: '',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
})

const Partner = mongoose.model('Partner', PartnerSchema);
export default Partner