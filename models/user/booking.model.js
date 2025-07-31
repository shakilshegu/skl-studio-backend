// // models/booking.model.js
// import mongoose from 'mongoose';

// const bookingSchema = new mongoose.Schema({
//   // Booking can be for either a studio or a freelancer
//   bookingType: {
//     type: String,
//     enum: ['studio', 'freelancer'],
//     required: true
//   },
  
//   // Reference to either studio or freelancer
//   studioId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'partnerstudios',
//     required: function() {
//       return this.bookingType === 'studio';
//     }
//   },
  
//   freelancerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Freelancer',
//     required: function() {
//       return this.bookingType === 'freelancer';
//     }
//   },
  
//   // User who made the booking
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
  
//   // Slot information - parent slot document
//   slotId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Slot',
//     required: true
//   },
  
//   // Just store the from and to slot IDs
//   fromSlotId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true
//   },
  
//   toSlotId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true
//   },
  
//   bookingDate: {
//     type: Date,
//     required: true
//   },
  
//   // Rate type and price
//   rateType: {
//     type: String,
//     enum: ['hourly', 'daily'],
//     required: true
//   },
  
//   price: {
//     type: Number,
//     required: true
//   },
  
//   // Optional selections
//   selectedPackages: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Package'
//   }],
  
//   selectedServices: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Service'
//   }],
  
//   selectedEquipments: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Equipment'
//   }],
  
//   selectedHelpers: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Helper'
//   }],
  
//   // Additional costs
//   additionalCosts: [{
//     description: { type: String, required: true },
//     amount: { type: Number, required: true }
//   }],
  
//   // Subtotal, taxes, discount, and total
//   subtotal: {
//     type: Number,
//     required: true
//   },
  
//   taxPercentage: {
//     type: Number,
//     default: 18 // Default GST
//   },
  
//   taxAmount: {
//     type: Number,
//     required: true
//   },
  
//   discountAmount: {
//     type: Number,
//     default: 0
//   },
  
//   totalAmount: {
//     type: Number,
//     required: true
//   },
  
//   // Payment details
//   paymentStatus: {
//     type: String,
//     enum: ['pending', 'partially_paid', 'paid', 'refunded', 'cancelled'],
//     default: 'pending'
//   },
  
//   advanceAmount: {
//     type: Number,
//     default: 0
//   },
  
//   balanceAmount: {
//     type: Number,
//     required: true
//   },
  
//   // Payment transactions
//   transactions: [{
//     transactionId: { type: String },
//     amount: { type: Number, required: true },
//     paymentMethod: { 
//       type: String, 
//       enum: ['cash', 'upi', 'card', 'bank_transfer'],
//       required: true
//     },
//     paymentDate: { type: Date, default: Date.now },
//     status: { 
//       type: String, 
//       enum: ['success', 'failed', 'pending'],
//       required: true
//     }
//   }],
  
//   // Booking status
//   status: {
//     type: String,
//     enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
//     default: 'pending'
//   },
  
//   // Cancellation details (if applicable)
//   cancellation: {
//     cancelledAt: { type: Date },
//     reason: { type: String },
//     refundAmount: { type: Number, default: 0 },
//     refundStatus: { 
//       type: String, 
//       enum: ['not_applicable', 'pending', 'processed', 'rejected'],
//       default: 'not_applicable'
//     }
//   },
  
//   // Notes and special requests
//   specialRequests: {
//     type: String
//   },
  
//   adminNotes: {
//     type: String
//   },
  
//   // Timestamps
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
  
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// // Pre-save middleware to calculate totals
// bookingSchema.pre('save', function(next) {
//   // Calculate tax amount
//   this.taxAmount = (this.subtotal * this.taxPercentage) / 100;
  
//   // Calculate total amount
//   this.totalAmount = this.subtotal + this.taxAmount - this.discountAmount;
  
//   // Calculate balance amount
//   this.balanceAmount = this.totalAmount - this.advanceAmount;
  
//   next();
// });

// const Booking = mongoose.model('Booking', bookingSchema);
// export default Booking;




// models/Booking.js 15-05 date document id
// import mongoose from 'mongoose';

// const bookingSchema = new mongoose.Schema({
//   // User details
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
  
//   // Entity details (studio OR freelancer)
//   entityType: {
//     type: String,
//     enum: ['studio', 'freelancer'],
//     required: true
//   },
//   entityId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true
//   },
  
//   // Separate fields for studio and freelancer (conditional)
//   studioId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Studio',
//     required: function() { return this.entityType === 'studio'; }
//   },
//   freelancerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Freelancer',
//     required: function() { return this.entityType === 'freelancer'; }
//   },
  
//   // Cart items
//   services: [{
//     serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
//     name: String,
//     price: Number,
//     count: Number
//   }],
//   equipments: [{
//     equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
//     name: String,
//     price: Number,
//     count: Number
//   }],
//   packages: [{
//     packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
//     name: String,
//     price: Number,
//     count: Number
//   }],
//   helpers: [{
//     helperId: { type: mongoose.Schema.Types.ObjectId, ref: 'Helper' },
//     name: String,
//     price: Number,
//     count: Number
//   }],
  
//   // Date and time
//   bookingDates: [{
//     date: {
//       type: Date,
//       required: true
//     },
//     startTime: {
//       type: Number,
//       required: true
//     },
//     endTime: {
//       type: Number,
//       required: true
//     },
//     isWholeDay: {
//       type: Boolean,
//       default: false
//     },
//     dateDocumentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Availability' }, // NEW: Reference to the availability document
//     slots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Slot' }]
//   }],
  
//   // Pricing
//   subtotal: {
//     type: Number,
//     required: true,
//     default: 0
//   },
//   gstAmount: {
//     type: Number,
//     required: true,
//     default: 0
//   },
//   platformFee: {
//     type: Number,
//     required: true,
//     default: 500
//   },
//   totalAmount: {
//     type: Number,
//     required: true,
//     default: 0
//   },
//   advanceAmount: {
//     type: Number,
//     required: true,
//     default: 0
//   },
//   onSiteAmount: {
//     type: Number,
//     required: true,
//     default: 0
//   },
  
//   // Booking status
//   status: {
//     type: String,
//     enum: ['pending', 'confirmed', 'cancelled', 'completed'],
//     default: 'pending'
//   },
  
//   // Metadata
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Pre-save validation to ensure only one entity type is set
// bookingSchema.pre('save', function(next) {
//   if (this.entityType === 'studio') {
//     this.freelancerId = undefined;
//   } else if (this.entityType === 'freelancer') {
//     this.studioId = undefined;
//   }
//   next();
// });

// // Virtual to calculate total hours
// bookingSchema.virtual('totalHours').get(function() {
//   if (!this.bookingDates || this.bookingDates.length === 0) {
//     return 0;
//   }
//   return this.bookingDates.reduce((total, booking) => {
//     return total + (booking.endTime - booking.startTime);
//   }, 0);
// });

// // Virtual for getting the entity reference
// bookingSchema.virtual('entity', {
//   ref: function() {
//     return this.entityType === 'studio' ? 'Studio' : 'Freelancer';
//   },
//   localField: 'entityId',
//   foreignField: '_id',
//   justOne: true
// });

// // Ensure virtual fields are included in JSON output
// bookingSchema.set('toJSON', { virtuals: true });
// bookingSchema.set('toObject', { virtuals: true });

// export default mongoose.model('Booking', bookingSchema);












// // models/user/booking.model.js
// import mongoose from 'mongoose';

// const bookingSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
  
//   // Entity information
//   entityType: {
//     type: String,
//     enum: ['studio', 'freelancer'],
//     required: true
//   },
//   entityId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true
//   },
  
//   // Specific references based on entity type
//   studioId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'partnerStudio',
//     required: function() {
//       return this.entityType === 'studio';
//     }
//   },
//   freelancerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Freelancer',
//     required: function() {
//       return this.entityType === 'freelancer';
//     }
//   },
  
//   // Cart items
//   services: [{
//     serviceId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Service',
//       required: true
//     },
//     name: String,
//     price: Number,
//     count: {
//       type: Number,
//       default: 1
//     }
//   }],
  
//   equipments: [{
//     equipmentId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Equipment',
//       required: true
//     },
//     name: String,
//     price: Number,
//     count: {
//       type: Number,
//       default: 1
//     }
//   }],
  
//   packages: [{
//     packageId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Package',
//       required: true
//     },
//     name: String,
//     price: Number,
//     count: {
//       type: Number,
//       default: 1
//     }
//   }],
  
//   helpers: [{
//     helperId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Helper',
//       required: true
//     },
//     name: String,
//     price: Number,
//     count: {
//       type: Number,
//       default: 1
//     }
//   }],
  
//   // Booking dates with availability document reference
//   bookingDates: [{
//     date: {
//       type: Date,
//       required: true
//     },
//     startTime: {
//       type: Number,
//       required: true
//     },
//     endTime: {
//       type: Number,
//       required: true
//     },
//     isWholeDay: {
//       type: Boolean,
//       default: false
//     },
//     // Reference to the availability document
//     dateDocumentId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Availability',
//       required: true
//     },
//     // Array of slot IDs within the availability document
//     slots: [{
//       type: mongoose.Schema.Types.ObjectId,
//       required: true
//     }]
//   }],
  
//   // Pricing information
//   subtotal: {
//     type: Number,
//     required: true
//   },
//   gstAmount: {
//     type: Number,
//     required: true
//   },
//   platformFee: {
//     type: Number,
//     required: true
//   },
//   totalAmount: {
//     type: Number,
//     required: true
//   },
//   advanceAmount: {
//     type: Number,
//     required: true
//   },
//   onSiteAmount: {
//     type: Number,
//     required: true
//   },
  
//   // Booking status
//   status: {
//     type: String,
//     enum: ['pending', 'confirmed', 'cancelled', 'completed'],
//     default: 'pending'
//   },
  
//   // Additional fields
//   notes: {
//     type: String,
//     default: ''
//   },
//   cancellationReason: {
//     type: String
//   },
//   cancelledAt: {
//     type: Date
//   }
// }, {
//   timestamps: true
// });

// // Add indexes for better query performance
// bookingSchema.index({ userId: 1, status: 1 });
// bookingSchema.index({ studioId: 1, status: 1 });
// bookingSchema.index({ freelancerId: 1, status: 1 });
// bookingSchema.index({ 'bookingDates.date': 1 });
// bookingSchema.index({ entityType: 1, entityId: 1 });

// // Pre-save hook to validate slot availability (optional but recommended)
// bookingSchema.pre('save', async function(next) {
//   // Only run validation on new documents or when booking dates change
//   if (this.isNew || this.isModified('bookingDates')) {
//     try {
//       // Validate that all slot IDs exist in their respective availability documents
//       for (const bookingDate of this.bookingDates) {
//         if (bookingDate.dateDocumentId && bookingDate.slots.length > 0) {
//           const Availability = mongoose.model('Availability');
//           const availability = await Availability.findById(bookingDate.dateDocumentId);
          
//           if (availability) {
//             const validSlotIds = availability.timeSlots.map(slot => slot._id.toString());
//             const invalidSlots = bookingDate.slots.filter(slotId => 
//               !validSlotIds.includes(slotId.toString())
//             );
            
//             if (invalidSlots.length > 0) {
//               throw new Error(`Invalid slot IDs for date ${bookingDate.date}: ${invalidSlots.join(', ')}`);
//             }
//           } else {
//             throw new Error(`Availability document not found: ${bookingDate.dateDocumentId}`);
//           }
//         }
//       }
//       next();
//     } catch (error) {
//       next(error);
//     }
//   } else {
//     next();
//   }
// });

// // Virtual for getting total duration
// bookingSchema.virtual('totalDuration').get(function() {
//   return this.bookingDates.reduce((total, booking) => {
//     return total + (booking.endTime - booking.startTime);
//   }, 0);
// });

// // Virtual for getting booking date range
// bookingSchema.virtual('dateRange').get(function() {
//   if (this.bookingDates.length === 0) return null;
  
//   const dates = this.bookingDates.map(bd => bd.date).sort();
//   const startDate = dates[0];
//   const endDate = dates[dates.length - 1];
  
//   return {
//     start: startDate,
//     end: endDate,
//     totalDays: this.bookingDates.length
//   };
// });

// // Method to check if booking can be cancelled
// bookingSchema.methods.canBeCancelled = function() {
//   // Can be cancelled if status is pending or confirmed and not within 24 hours of start time
//   if (!['pending', 'confirmed'].includes(this.status)) {
//     return false;
//   }
  
//   const firstBookingDate = this.bookingDates.sort((a, b) => a.date - b.date)[0];
//   const bookingDateTime = new Date(firstBookingDate.date);
//   bookingDateTime.setHours(firstBookingDate.startTime, 0, 0, 0);
  
//   const now = new Date();
//   const hoursUntilBooking = (bookingDateTime - now) / (1000 * 60 * 60);
  
//   return hoursUntilBooking > 24; // Can cancel if more than 24 hours away
// };

// export default mongoose.model('Booking', bookingSchema);



//========================payment history============

// Updated booking model - make advance and onsite amounts optional

// import mongoose from 'mongoose';


// const bookingSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
  
//   // Entity information
//   entityType: {
//     type: String,
//     enum: ['studio', 'freelancer'],
//     required: true
//   },
//   entityId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true
//   },
  
//   // Specific references based on entity type
//   studioId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'partnerstudios',
//     required: function() {
//       return this.entityType === 'studio';
//     }
//   },
//   freelancerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Freelancer',
//     required: function() {
//       return this.entityType === 'freelancer';
//     }
//   },
  
//   // Cart items (keeping existing structure)
//   services: [{
//     serviceId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Service',
//       required: true
//     },
//     name: String,
//     price: Number,
//     count: {
//       type: Number,
//       default: 1
//     }
//   }],
  
//   equipments: [{
//     equipmentId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Equipment',
//       required: true
//     },
//     name: String,
//     price: Number,
//     count: {
//       type: Number,
//       default: 1
//     }
//   }],
  
//   packages: [{
//     packageId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Package',
//       required: true
//     },
//     name: String,
//     price: Number,
//     count: {
//       type: Number,
//       default: 1
//     }
//   }],
  
//   helpers: [{
//     helperId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Helper',
//       required: true
//     },
//     name: String,
//     price: Number,
//     count: {
//       type: Number,
//       default: 1
//     }
//   }],
  
//   // Booking dates with availability document reference
//   bookingDates: [{
//     date: {
//       type: Date,
//       required: true
//     },
//     startTime: {
//       type: Number,
//       required: true
//     },
//     endTime: {
//       type: Number,
//       required: true
//     },
//     isWholeDay: {
//       type: Boolean,
//       default: false
//     },
//     // Reference to the availability document
//     dateDocumentId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Availability',
//       required: true
//     },
//     // Array of slot IDs within the availability document
//     slots: [{
//       type: mongoose.Schema.Types.ObjectId,
//       required: true
//     }]
//   }],
  
//   // Pricing information
//   subtotal: {
//     type: Number,
//     required: true
//   },
//   gstAmount: {
//     type: Number,
//     required: true
//   },
//   platformFee: {
//     type: Number,
//     required: true
//   },
//   totalAmount: {
//     type: Number,
//     required: true
//   },
  
//   // UPDATED: Make these optional (only for advance payments)
//   advanceAmount: {
//     type: Number,
//     required: false  // Changed from required: true
//   },
//   onSiteAmount: {
//     type: Number,
//     required: false  // Changed from required: true
//   },
  
//   // Track the initial payment type
//   initialPaymentType: {
//     type: String,
//     enum: ['advance', 'full'],
//     required: true
//   },
  
//   // Payment tracking fields
//   totalPaid: {
//     type: Number,
//     default: 0,
//     validate: {
//       validator: function(value) {
//         return value >= 0 && value <= this.totalAmount;
//       },
//       message: 'Total paid cannot be negative or exceed total amount'
//     }
//   },
//   pendingAmount: {
//     type: Number,
//     default: function() {
//       return this.totalAmount - (this.totalPaid || 0);
//     }
//   },
  
//   // Payment status tracking
//   paymentStatus: {
//     type: String,
//     enum: ['pending', 'partial', 'completed', 'refunded'],
//     default: function() {
//       if (this.totalPaid === 0) return 'pending';
//       if (this.totalPaid < this.totalAmount) return 'partial';
//       if (this.totalPaid >= this.totalAmount) return 'completed';
//       return 'pending';
//     }
//   },
  
//   // Payment history for tracking all payments
//   paymentHistory: [{
//     amount: {
//       type: Number,
//       required: true
//     },
//     paymentMethod: {
//       type: String,
//       enum: ['online', 'cash', 'card', 'upi', 'other'],
//       required: true
//     },
//     paymentType: {
//       type: String,
//       enum: ['advance', 'partial', 'full', 'balance'],
//       required: true
//     },
//     transactionId: String,
//     orderId: String,
//     paymentDate: {
//       type: Date,
//       default: Date.now
//     },
//     paidBy: {
//       type: String,
//       enum: ['customer', 'admin', 'partner'],
//       default: 'customer'
//     },
//     notes: String,
//     orderRef: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Order'
//     }
//   }],
  
//   // Booking status
//   status: {
//     type: String,
//     enum: ['pending', 'confirmed', 'cancelled', 'completed', 'in-progress'],
//     default: 'pending'
//   },
  
//   // Additional fields (keeping existing)
//   notes: {
//     type: String,
//     default: ''
//   },
//   cancellationReason: {
//     type: String
//   },
//   cancelledAt: {
//     type: Date
//   },
//   actualStartTime: Date,
//   actualEndTime: Date,
//   rating: {
//     type: Number,
//     min: 1,
//     max: 5
//   },
//   feedback: String,
//   feedbackDate: Date
// }, {
//   timestamps: true
// });


// // Add indexes for better query performance
// bookingSchema.index({ userId: 1, status: 1 });
// bookingSchema.index({ studioId: 1, status: 1 });
// bookingSchema.index({ freelancerId: 1, status: 1 });
// bookingSchema.index({ 'bookingDates.date': 1 });
// bookingSchema.index({ entityType: 1, entityId: 1 });
// bookingSchema.index({ paymentStatus: 1 });

// // Pre-save middleware to update payment status and pending amount
// bookingSchema.pre('save', function(next) {
//   // Calculate pending amount
//   this.pendingAmount = this.totalAmount - this.totalPaid;
  
//   // Update payment status based on totalPaid
//   if (this.totalPaid === 0) {
//     this.paymentStatus = 'pending';
//   } else if (this.totalPaid < this.totalAmount) {
//     this.paymentStatus = 'partial';
//   } else if (this.totalPaid >= this.totalAmount) {
//     this.paymentStatus = 'completed';
//   }
  
//   next();
// });

// // Pre-save hook to validate slot availability (keep existing validation)
// bookingSchema.pre('save', async function(next) {
//   // Only run validation on new documents or when booking dates change
//   if (this.isNew || this.isModified('bookingDates')) {
//     try {
//       // Validate that all slot IDs exist in their respective availability documents
//       for (const bookingDate of this.bookingDates) {
//         if (bookingDate.dateDocumentId && bookingDate.slots.length > 0) {
//           const Availability = mongoose.model('Availability');
//           const availability = await Availability.findById(bookingDate.dateDocumentId);
          
//           if (availability) {
//             const validSlotIds = availability.timeSlots.map(slot => slot._id.toString());
//             const invalidSlots = bookingDate.slots.filter(slotId => 
//               !validSlotIds.includes(slotId.toString())
//             );
            
//             if (invalidSlots.length > 0) {
//               throw new Error(`Invalid slot IDs for date ${bookingDate.date}: ${invalidSlots.join(', ')}`);
//             }
//           } else {
//             throw new Error(`Availability document not found: ${bookingDate.dateDocumentId}`);
//           }
//         }
//       }
//       next();
//     } catch (error) {
//       next(error);
//     }
//   } else {
//     next();
//   }
// });

// // Virtual for getting total duration
// bookingSchema.virtual('totalDuration').get(function() {
//   return this.bookingDates.reduce((total, booking) => {
//     return total + (booking.endTime - booking.startTime);
//   }, 0);
// });

// // Virtual for getting booking date range
// bookingSchema.virtual('dateRange').get(function() {
//   if (this.bookingDates.length === 0) return null;
  
//   const dates = this.bookingDates.map(bd => bd.date).sort();
//   const startDate = dates[0];
//   const endDate = dates[dates.length - 1];
  
//   return {
//     start: startDate,
//     end: endDate,
//     totalDays: this.bookingDates.length
//   };
// });

// // Virtual to check if payment is complete
// bookingSchema.virtual('isPaymentComplete').get(function() {
//   return this.totalPaid >= this.totalAmount;
// });

// // Virtual to get payment completion percentage
// bookingSchema.virtual('paymentProgress').get(function() {
//   return (this.totalPaid / this.totalAmount) * 100;
// });

// // Method to check if booking can be cancelled
// bookingSchema.methods.canBeCancelled = function() {
//   // Can be cancelled if status is pending or confirmed and not within 24 hours of start time
//   if (!['pending', 'confirmed'].includes(this.status)) {
//     return false;
//   }
  
//   const firstBookingDate = this.bookingDates.sort((a, b) => a.date - b.date)[0];
//   const bookingDateTime = new Date(firstBookingDate.date);
//   bookingDateTime.setHours(firstBookingDate.startTime, 0, 0, 0);
  
//   const now = new Date();
//   const hoursUntilBooking = (bookingDateTime - now) / (1000 * 60 * 60);
  
//   return hoursUntilBooking > 24; // Can cancel if more than 24 hours away
// };

// // Method to add payment
// bookingSchema.methods.addPayment = function(paymentData) {
//   const {
//     amount,
//     paymentMethod = 'online',
//     paymentType = 'partial',
//     transactionId,
//     orderId,
//     paidBy = 'customer',
//     notes
//   } = paymentData;
  
//   // Add to payment history
//   this.paymentHistory.push({
//     amount,
//     paymentMethod,
//     paymentType,
//     transactionId,
//     orderId,
//     paidBy,
//     notes,
//     paymentDate: new Date()
//   });
  
//   // Update total paid
//   this.totalPaid += amount;
  
//   // Ensure we don't exceed total amount
//   if (this.totalPaid > this.totalAmount) {
//     this.totalPaid = this.totalAmount;
//   }
  
//   return this.save();
// };

// // Method to get remaining amount for specific payment type
// bookingSchema.methods.getRemainingAmount = function(paymentType = 'full') {
//   if (paymentType === 'advance') {
//     return Math.max(0, this.advanceAmount - this.totalPaid);
//   }
//   return Math.max(0, this.totalAmount - this.totalPaid);
// };

// export default mongoose.model('Booking', bookingSchema);

//with random booking id 

import mongoose from 'mongoose';

// Function to generate unique booking ID
const generateBookingId = () => {
  const now = new Date();
  
  // Get date components
  const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  
  // Generate random 2-digit number for uniqueness
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  
  // Format: BK + YYMMDD + HHMM + RR
  // Example: BK2505171530 + 42 = BK250517153042 (14 chars)
  // Or shorter version: BK + YYMMDDHHMM + R
  // Example: BK2505171530 + 4 = BK25051715304 (13 chars)
  
  return `ALK${year}${month}${day}${hour}${minute}${random}`;
};





const bookingSchema = new mongoose.Schema({
  // Add booking ID field
  bookingId: {
    type: String,
    unique: true,
    default: generateBookingId, // You can change this to generateShortBookingId or generateNumericBookingId
    index: true
  },
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Entity information
  entityType: {
    type: String,
    enum: ['studio', 'freelancer'],
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  
  // Specific references based on entity type
  studioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'partnerstudios',
    required: function() {
      return this.entityType === 'studio';
    }
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Freelancer',
    required: function() {
      return this.entityType === 'freelancer';
    }
  },
  
  // Cart items (keeping existing structure)
  services: [{
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    name: String,
    price: Number,
    count: {
      type: Number,
      default: 1
    }
  }],
  
  equipments: [{
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: true
    },
    name: String,
    price: Number,
    count: {
      type: Number,
      default: 1
    }
  }],
  
  packages: [{
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: true
    },
    name: String,
    price: Number,
    count: {
      type: Number,
      default: 1
    }
  }],
  
  helpers: [{
    helperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Helper',
      required: true
    },
    name: String,
    price: Number,
    count: {
      type: Number,
      default: 1
    }
  }],
  
  // Booking dates with availability document reference
  bookingDates: [{
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: Number,
      required: true
    },
    endTime: {
      type: Number,
      required: true
    },
    isWholeDay: {
      type: Boolean,
      default: false
    },
    // Reference to the availability document
    dateDocumentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Availability',
      required: true
    },
    // Array of slot IDs within the availability document
    slots: [{
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }]
  }],
  
  // Pricing information
  subtotal: {
    type: Number,
    required: true
  },
  gstAmount: {
    type: Number,
    required: true
  },
  platformFee: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  
  // UPDATED: Make these optional (only for advance payments)
  advanceAmount: {
    type: Number,
    required: false
  },
  onSiteAmount: {
    type: Number,
    required: false
  },
  
  // Track the initial payment type
  initialPaymentType: {
    type: String,
    enum: ['advance', 'full'],
    required: true
  },
  
  // Payment tracking fields
  totalPaid: {
    type: Number,
    default: 0,
    validate: {
      validator: function(value) {
        return value >= 0 && value <= this.totalAmount;
      },
      message: 'Total paid cannot be negative or exceed total amount'
    }
  },
  pendingAmount: {
    type: Number,
    default: function() {
      return this.totalAmount - (this.totalPaid || 0);
    }
  },
  
  // Payment status tracking
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'refunded'],
    default: function() {
      if (this.totalPaid === 0) return 'pending';
      if (this.totalPaid < this.totalAmount) return 'partial';
      if (this.totalPaid >= this.totalAmount) return 'completed';
      return 'pending';
    }
  },
  
  // Payment history for tracking all payments
  paymentHistory: [{
    amount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['online', 'cash', 'card', 'upi', 'other'],
      required: true
    },
    paymentType: {
      type: String,
      enum: ['advance', 'partial', 'full', 'balance'],
      required: true
    },
    transactionId: String,
    orderId: String,
    paymentDate: {
      type: Date,
      default: Date.now
    },
    paidBy: {
      type: String,
      enum: ['customer', 'admin', 'partner'],
      default: 'customer'
    },
    notes: String,
    orderRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  }],
  
  // Booking status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'in-progress'],
    default: 'pending'
  },
  
  // Additional fields (keeping existing)
  notes: {
    type: String,
    default: ''
  },
  cancellationReason: {
    type: String
  },
  cancelledAt: {
    type: Date
  },
  actualStartTime: Date,
  actualEndTime: Date,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String,
  feedbackDate: Date
}, {
  timestamps: true
});

// Add indexes for better query performance
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ studioId: 1, status: 1 });
bookingSchema.index({ freelancerId: 1, status: 1 });
bookingSchema.index({ 'bookingDates.date': 1 });
bookingSchema.index({ entityType: 1, entityId: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ bookingId: 1 }); // Add index for bookingId

// Pre-save middleware to ensure bookingId is generated
bookingSchema.pre('save', function(next) {
  // Generate bookingId if it doesn't exist (for new documents)
  if (this.isNew && !this.bookingId) {
    this.bookingId = generateBookingId();
  }
  
  // Calculate pending amount
  this.pendingAmount = this.totalAmount - this.totalPaid;
  
  // Update payment status based on totalPaid
  if (this.totalPaid === 0) {
    this.paymentStatus = 'pending';
  } else if (this.totalPaid < this.totalAmount) {
    this.paymentStatus = 'partial';
  } else if (this.totalPaid >= this.totalAmount) {
    this.paymentStatus = 'completed';
  }
  
  next();
});

// Pre-save hook to validate slot availability (keep existing validation)
bookingSchema.pre('save', async function(next) {
  // Only run validation on new documents or when booking dates change
  if (this.isNew || this.isModified('bookingDates')) {
    try {
      // Validate that all slot IDs exist in their respective availability documents
      for (const bookingDate of this.bookingDates) {
        if (bookingDate.dateDocumentId && bookingDate.slots.length > 0) {
          const Availability = mongoose.model('Availability');
          const availability = await Availability.findById(bookingDate.dateDocumentId);
          
          if (availability) {
            const validSlotIds = availability.timeSlots.map(slot => slot._id.toString());
            const invalidSlots = bookingDate.slots.filter(slotId => 
              !validSlotIds.includes(slotId.toString())
            );
            
            if (invalidSlots.length > 0) {
              throw new Error(`Invalid slot IDs for date ${bookingDate.date}: ${invalidSlots.join(', ')}`);
            }
          } else {
            throw new Error(`Availability document not found: ${bookingDate.dateDocumentId}`);
          }
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Virtual for getting total duration
bookingSchema.virtual('totalDuration').get(function() {
  return this.bookingDates.reduce((total, booking) => {
    return total + (booking.endTime - booking.startTime);
  }, 0);
});

// Virtual for getting booking date range
bookingSchema.virtual('dateRange').get(function() {
  if (this.bookingDates.length === 0) return null;
  
  const dates = this.bookingDates.map(bd => bd.date).sort();
  const startDate = dates[0];
  const endDate = dates[dates.length - 1];
  
  return {
    start: startDate,
    end: endDate,
    totalDays: this.bookingDates.length
  };
});

// Virtual to check if payment is complete
bookingSchema.virtual('isPaymentComplete').get(function() {
  return this.totalPaid >= this.totalAmount;
});

// Virtual to get payment completion percentage
bookingSchema.virtual('paymentProgress').get(function() {
  return (this.totalPaid / this.totalAmount) * 100;
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  // Can be cancelled if status is pending or confirmed and not within 24 hours of start time
  if (!['pending', 'confirmed'].includes(this.status)) {
    return false;
  }
  
  const firstBookingDate = this.bookingDates.sort((a, b) => a.date - b.date)[0];
  const bookingDateTime = new Date(firstBookingDate.date);
  bookingDateTime.setHours(firstBookingDate.startTime, 0, 0, 0);
  
  const now = new Date();
  const hoursUntilBooking = (bookingDateTime - now) / (1000 * 60 * 60);
  
  return hoursUntilBooking > 24; // Can cancel if more than 24 hours away
};

// Method to add payment
bookingSchema.methods.addPayment = function(paymentData) {
  const {
    amount,
    paymentMethod = 'online',
    paymentType = 'partial',
    transactionId,
    orderId,
    paidBy = 'customer',
    notes
  } = paymentData;
  
  // Add to payment history
  this.paymentHistory.push({
    amount,
    paymentMethod,
    paymentType,
    transactionId,
    orderId,
    paidBy,
    notes,
    paymentDate: new Date()
  });
  
  // Update total paid
  this.totalPaid += amount;
  
  // Ensure we don't exceed total amount
  if (this.totalPaid > this.totalAmount) {
    this.totalPaid = this.totalAmount;
  }
  
  return this.save();
};

// Method to get remaining amount for specific payment type
bookingSchema.methods.getRemainingAmount = function(paymentType = 'full') {
  if (paymentType === 'advance') {
    return Math.max(0, this.advanceAmount - this.totalPaid);
  }
  return Math.max(0, this.totalAmount - this.totalPaid);
};

// Static method to find booking by bookingId
bookingSchema.statics.findByBookingId = function(bookingId) {
  return this.findOne({ bookingId });
};

export default mongoose.model('Booking', bookingSchema);