// models/TeamMember.js
import  mongoose from 'mongoose'
const Schema = mongoose.Schema;

const teamMemberSchema = new Schema({
  studioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'partnerstudios',
        required: true
      },
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['Cameraman', 'Videographer', 'Editor', 'Helper']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required']
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: '/Assets/partner/TeamMumber.svg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // This automatically manages createdAt and updatedAt
});

export default mongoose.model('TeamMember', teamMemberSchema);