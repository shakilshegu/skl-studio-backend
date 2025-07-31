// models/TeamMember.js
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const teamMemberSchema = new Schema({
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'entityRef' // Reference to virtual field
  },
  entityType: {
    type: String,
    required: true,
    enum: ['studio', 'freelancer'] // Human readable values
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
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual field to map entityType to actual model names for refs
teamMemberSchema.virtual('entityRef').get(function() {
  switch (this.entityType) {
    case 'studio':
      return 'partnerstudios';
    case 'freelancer':
      return 'Freelancer';
    default:
      return null;
  }
});

// Index for better query performance
teamMemberSchema.index({ entityId: 1, entityType: 1 });
teamMemberSchema.index({ email: 1 });

export default mongoose.model('TeamMember', teamMemberSchema);