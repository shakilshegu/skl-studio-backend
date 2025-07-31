import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Business details model
const BusinessProfileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vendorName: { type: String, required: true },
  vendorType: { 
    type: String, 
    enum: ['Freelancer', 'Studio Owner'], 
    required: true 
  },
  teamSize: { type: Number, required: true },
  country: { 
    type: String, 
    default: 'India', 
    required: true 
  },
  state: { type: String, required: true },
  city: { type: String, required: true },
  instagramHandle: { type: String },
  categoriesSpecialized: [{ type: String }], // Changed to array for multiple categories
  equipmentList: [{ type: String }], // Changed to array for multiple equipment
  avgBookingDays: { type: Number },
  inHouseDesigner: { 
    type: String,
    enum: ['I outsource', 'Yes', 'No'],
    default: 'No'
  },

  traveledOutsideCountry: { type: Boolean, default: false },
  countriesTraveled: [ { type: String }],
  eventsOutsideCountry:[ { type: String }],
  traveledOutsideCity: { type: Boolean, default: false },
  citiesTraveled:  [ { type: String }],
  eventsOutsideCity:[ { type: String }],
  
  openToTravel: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update the updatedAt field
BusinessProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const BusinessProfile = mongoose.model('BusinessProfile', BusinessProfileSchema);

export default BusinessProfile;