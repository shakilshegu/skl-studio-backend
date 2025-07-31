// // controllers/paymentController.js
// import Razorpay from 'razorpay';
// import crypto from 'crypto';
// import Order from '../../models/user/order.model.js';
// import Booking from '../../models/user/booking.model.js';

// // controllers/paymentController.js
// import Service from '../../models/partner/service.model.js';
// import Equipment from '../../models/partner/equipment.model.js';
// import Package from '../../models/partner/package.model.js';
// import Helper from '../../models/partner/helper.model.js';
// import mongoose from 'mongoose';

// // Initialize Razorpay instance
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_API_KEY,
//   key_secret: process.env.RAZORPAY_SECRET_KEY,
// });



// const calculateInvoice = async (cartData, studioHours = 0, studioPrice = 0) => {
//   try {
//     console.log(cartData, "cartData received");
    
//     // Extract IDs from your cart data structure
//     const serviceIds = Object.keys(cartData.services || {});
//     const equipmentIds = Object.keys(cartData.equipments || {});
//     const packageIds = Object.keys(cartData.packages || {});
//     const helperIds = Object.keys(cartData.helpers || {});
    
//     console.log('IDs extracted:', {
//       serviceIds,
//       equipmentIds,
//       packageIds,
//       helperIds
//     });
    
//     // Batch fetch all items
//     const [services, equipments, packages, helpers] = await Promise.all([
//       Service.find({ _id: { $in: serviceIds } }),
//       Equipment.find({ _id: { $in: equipmentIds } }),
//       Package.find({ _id: { $in: packageIds } }),
//       Helper.find({ _id: { $in: helperIds } })
//     ]);
    
//     // Create lookup maps
//     const serviceMap = services.reduce((map, service) => {
//       map[service._id.toString()] = service;
//       return map;
//     }, {});
    
//     const equipmentMap = equipments.reduce((map, equipment) => {
//       map[equipment._id.toString()] = equipment;
//       return map;
//     }, {});
    
//     const packageMap = packages.reduce((map, pkg) => {
//       map[pkg._id.toString()] = pkg;
//       return map;
//     }, {});
    
//     const helperMap = helpers.reduce((map, helper) => {
//       map[helper._id.toString()] = helper;
//       return map;
//     }, {});
    
//     // Calculate totals using your cart structure
//     const servicesTotal = Object.entries(cartData.services || {}).reduce((sum, [id, { count }]) => {
//       const service = serviceMap[id];
//       if (!service) {
//         console.warn(`Service not found for ID: ${id}`);
//         return sum;
//       }
//       return sum + (service.price * count);
//     }, 0);
    
//     const equipmentsTotal = Object.entries(cartData.equipments || {}).reduce((sum, [id, { count }]) => {
//       const equipment = equipmentMap[id];
//       if (!equipment) {
//         console.warn(`Equipment not found for ID: ${id}`);
//         return sum;
//       }
//       return sum + (equipment.price * count);
//     }, 0);
    
//     const packagesTotal = Object.entries(cartData.packages || {}).reduce((sum, [id, { count }]) => {
//       const packages = packageMap[id];
//       if (!packages) {
//         console.warn(`Package not found for ID: ${id}`);
//         return sum;
//       }
//       return sum + (packages.price * count);
//     }, 0);
    
//     const helpersTotal = Object.entries(cartData.helpers || {}).reduce((sum, [id, { count }]) => {
//       const helper = helperMap[id];
//       if (!helper) {
//         console.warn(`Helper not found for ID: ${id}`);
//         return sum;
//       }
//       return sum + (helper.price * count);
//     }, 0);
    
//     console.log('Calculated totals:', {
//       servicesTotal,
//       equipmentsTotal,
//       packagesTotal,
//       helpersTotal
//     });
    
//     // Studio cost
//     const studioTotal = studioPrice * studioHours;
    
//     // Calculate subtotal
//     const subtotal = studioTotal + servicesTotal + equipmentsTotal + packagesTotal + helpersTotal;
    
//     // Calculate GST (18%)
//     const gstRate = 18;
//     const gstAmount = (subtotal * gstRate) / 100;
    
//     // Platform fee
//     const platformFee = 500;
    
//     // Calculate grand total
//     const grandTotal = subtotal + gstAmount + platformFee;
    
//     // Calculate advance and on-site amounts
//     const advanceAmount = Math.round(grandTotal * 0.2); // 20%
//     const onSiteAmount = grandTotal - advanceAmount; // 80%
    
//     return {
//       subtotal,
//       gstAmount,
//       platformFee,
//       grandTotal,
//       advanceAmount,
//       onSiteAmount,
//       breakdown: {
//         studioTotal,
//         servicesTotal,
//         equipmentsTotal,
//         packagesTotal,
//         helpersTotal
//       }
//     };
//   } catch (error) {
//     console.error('Error calculating invoice:', error);
//     throw new Error('Invoice calculation failed');
//   }
// };

// // Updated createBookingFromReduxData function
// const createBookingFromReduxData = async (
//   cartData, 
//   bookingDates, 
//   userId, 
//   entityType, 
//   entityId, 
//   calculatedInvoice
// ) => {
//   try {
//     // Convert bookingDates object to array
//     const bookingDatesArray = Object.entries(bookingDates || {}).map(([date, booking]) => ({
//       date: new Date(date),
//       startTime: booking.startTime,
//       endTime: booking.endTime,
//       isWholeDay: booking.isWholeDay || false,
//       dateDocumentId: booking.dateDocumentId,
//       slots: (booking.slots || []).map(slotId => 
//         typeof slotId === 'string' ? new mongoose.Types.ObjectId(slotId) : slotId
//       )
//     }));
    
//     // Fetch full item details for booking storage
//     const serviceIds = Object.keys(cartData.services || {});
//     const equipmentIds = Object.keys(cartData.equipments || {});
//     const packageIds = Object.keys(cartData.packages || {});
//     const helperIds = Object.keys(cartData.helpers || {});
    
//     const [services, equipments, packages, helpers] = await Promise.all([
//       Service.find({ _id: { $in: serviceIds } }),
//       Equipment.find({ _id: { $in: equipmentIds } }),
//       Package.find({ _id: { $in: packageIds } }),
//       Helper.find({ _id: { $in: helperIds } })
//     ]);
    
//     // Convert to booking format with full details
//     const servicesForBooking = services.map(service => ({
//       serviceId: service._id,
//       name: service.name,
//       price: service.price,
//       count: cartData.services[service._id.toString()].count
//     }));
    
//     const equipmentsForBooking = equipments.map(equipment => ({
//       equipmentId: equipment._id,
//       name: equipment.name,
//       price: equipment.price,
//       count: cartData.equipments[equipment._id.toString()].count
//     }));
    
//     const packagesForBooking = packages.map(pkg => ({
//       packageId: pkg._id,
//       name: pkg.name,
//       price: pkg.price,
//       count: cartData.packages[pkg._id.toString()].count
//     }));
    
//     const helpersForBooking = helpers.map(helper => ({
//       helperId: helper._id,
//       name: helper.name,
//       price: helper.price,
//       count: cartData.helpers[helper._id.toString()].count
//     }));
    
//     // Prepare booking data
//     const bookingData = {
//       userId: userId,
//       entityType: entityType,
//       entityId: entityId,
      
//       // Add specific fields based on entity type
//       ...(entityType === 'studio' && { studioId: entityId }),
//       ...(entityType === 'freelancer' && { freelancerId: entityId }),
      
//       // Cart items with full details
//       services: servicesForBooking,
//       equipments: equipmentsForBooking,
//       packages: packagesForBooking,
//       helpers: helpersForBooking,
      
//       // Booking dates
//       bookingDates: bookingDatesArray,
      
//       // Use backend calculated pricing
//       subtotal: calculatedInvoice.subtotal,
//       gstAmount: calculatedInvoice.gstAmount,
//       platformFee: calculatedInvoice.platformFee,
//       totalAmount: calculatedInvoice.grandTotal,
//       advanceAmount: calculatedInvoice.advanceAmount,
//       onSiteAmount: calculatedInvoice.onSiteAmount,
      
//       // Initial status
//       status: 'pending'
//     };
    
//     // CREATE THE BOOKING
//     const booking = await Booking.create(bookingData);
//     return booking;
//   } catch (error) {
//     console.error('Error creating booking:', error);
//     throw error;
//   }
// };




// export const createOrder = async (req, res) => {
//   try {

// console.log(req.user._id,"uid");
// console.log(req.body,"rbd---------rbd");

// const userId=req.user._id

//     const { 
//       amount, 
//       currency = 'INR', 
//       paymentType = 'advance',
//       cartData,
//       bookingDates,
//       entityInfo,
//       frontendInvoice
//     } = req.body;
    
//     // Validate required fields
//     if (!amount || !userId || !cartData) {
//       return res.status(400).json({
//         success: false,
//         message: 'Amount, userId, and cartData are required'
//       });
//     }
    
//     // Extract entity info
//     const entityType = entityInfo?.entityType;
//     const entityId = entityType === 'studio' 
//       ? entityInfo?.studio?._id 
//       : entityInfo?.freelancer?._id;
    
//     if (!entityId || !entityType) {
//       return res.status(400).json({
//         success: false,
//         message: 'Entity information is required'
//       });
//     }
    
//     // Get studio/freelancer pricing
//     let studioPrice = 0;
//     if (entityType === 'studio') {
//       studioPrice = entityInfo.studio?.pricePerHour || 0;
//     } else if (entityType === 'freelancer') {
//       studioPrice = entityInfo.freelancer?.pricePerHour || 0;
//     }
    
//     // Calculate studio hours from booking dates
//     let studioHours = 0;
//     if (bookingDates && Object.keys(bookingDates).length > 0) {
//       studioHours = Object.values(bookingDates).reduce((total, booking) => {
//         return total + (booking.endTime - booking.startTime);
//       }, 0);
//     }
    
//     // Calculate invoice on backend
//     const backendInvoice = await calculateInvoice(cartData, studioHours, studioPrice);
//     console.log(backendInvoice,"bbbbbbbbbbbbbbbbbbbbbbbbbbpppppppppppppppppppppppppppppppppppppp");
    
//     // Validate against frontend calculation
//     if (frontendInvoice) {
//       const tolerance = 1; // Allow 1 rupee difference due to rounding
//       if (Math.abs(backendInvoice.grandTotal - frontendInvoice.grandTotal) > tolerance) {
//         return res.status(400).json({
//           success: false,
//           message: 'Invoice calculation mismatch between frontend and backend',
//           backendTotal: backendInvoice.grandTotal,
//           frontendTotal: frontendInvoice.grandTotal
//         });
//       }
//     }
    
//     // Determine payment amount based on type
//     const paymentAmount = paymentType === 'advance' 
//       ? backendInvoice.advanceAmount 
//       : backendInvoice.grandTotal;
    
//       console.log(paymentAmount,"pppppppppppppppppppppppppppppppppppppp");
      


//     // Validate requested amount matches calculated amount
//     if (Math.abs(amount - paymentAmount) > 1) {
//       return res.status(400).json({
//         success: false,
//         message: 'Payment amount mismatch',
//         expected: paymentAmount,
//         received: amount
//       });
//     }
    
//     // Create booking with all data
//     const booking = await createBookingFromReduxData(
//       cartData, 
//       bookingDates, 
//       userId, 
//       entityType, 
//       entityId, 
//       backendInvoice
//     );
    
//     // Create Razorpay order
//     const razorpayOrder = await razorpay.orders.create({
//       amount: paymentAmount * 100, // Convert to paise
//       currency: currency,
//       payment_capture: 1,
//       notes: {
//         bookingId: booking._id.toString(),
//         paymentType: paymentType,
//         userId: userId
//       }
//     });
    
//     // Create order record
//     const order = await Order.create({
//       orderId: razorpayOrder.id,
//       bookingId: booking._id,
//       amount: paymentAmount,
//       currency: currency,
//       paymentType: paymentType,
//       status: 'created'
//     });
    
//     res.status(200).json({ 
//       success: true, 
//       order: razorpayOrder,
//       orderRecord: order,
//       booking: booking._id,
//       calculatedInvoice: backendInvoice
//     });
//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Error creating order',
//       error: error.message 
//     });
//   }
// };

// export const verifyPayment = async (req, res) => {
//   try {
//     const { 
//         transactionId, 
//         orderId, 
//         signature
//       } = req.body;
    
//     // Validate required fields
//     if (!transactionId || !orderId || !signature) {
//       return res.status(400).json({
//         success: false,
//         message: 'Transaction ID, Order ID, and signature are required'
//       });
//     }
    
//     // Create signature string
//     const sign = orderId + "|" + transactionId;
    
//     // Generate expected signature
//     const expectedSign = crypto
//       .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
//       .update(sign.toString())
//       .digest("hex");
    
//       console.log("Transaction ID:", transactionId);
//       console.log("Order ID:", orderId);
//       console.log("Sign string:", sign);
//       console.log("Secret key exists:", !!process.env.RAZORPAY_SECRET_KEY);
//       console.log("Secret key value:", process.env.RAZORPAY_SECRET_KEY); // Remove this in production
//       console.log("Expected signature:", expectedSign);
//       console.log("Received signature:", signature);      

//     if (signature === expectedSign) {
//       // Payment verified successfully
//       const updatedOrder = await Order.findOneAndUpdate(
//         { orderId: orderId },
//         { 
//           status: 'paid',
//           paymentId: transactionId,
//           signature: signature,
//           paidAt: new Date()
//         },
//         { new: true }
//       ).populate('bookingId');
      
//       if (!updatedOrder) {
//         return res.status(404).json({
//           success: false,
//           message: 'Order not found'
//         });
//       }
      
//       // Update booking status
//       await Booking.findByIdAndUpdate(
//         updatedOrder.bookingId._id,
//         { 
//           status: 'confirmed', 
//           updatedAt: new Date() 
//         }
//       );
      
//       res.status(200).json({ 
//         success: true, 
//         message: 'Payment verified successfully',
//         order: updatedOrder,
//         paymentId: transactionId
//       });
//     } else {
//       // Invalid signature
//       const order = await Order.findOneAndUpdate(
//         { orderId: orderId },
//         { 
//           status: 'failed',
//           signature: signature,
//           failedAt: new Date()
//         },
//         { new: true }
//       ).populate('bookingId');
      
//       if (order && order.bookingId) {
//         await Booking.findByIdAndUpdate(
//           order.bookingId._id,
//           { 
//             status: 'cancelled',
//             updatedAt: new Date()
//           }
//         );
//       }
      
//       res.status(400).json({ 
//         success: false, 
//         message: 'Payment verification failed - Invalid signature' 
//       });
//     }
//   } catch (error) {
//     console.error('Error verifying payment:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Error verifying payment',
//       error: error.message 
//     });
//   }
// };

// export const getPaymentStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
    
//     const order = await Order.findOne({ orderId })
//       .populate('bookingId');
    
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       order: order
//     });
//   } catch (error) {
//     console.error('Error getting payment status:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error getting payment status',
//       error: error.message
//     });
//   }
// };

// export const getAllOrdersByBooking = async (req, res) => {
//   try {
//     const { bookingId } = req.params;
    
//     const orders = await Order.find({ bookingId })
//       .sort({ createdAt: -1 });
    
//     res.status(200).json({
//       success: true,
//       orders: orders
//     });
//   } catch (error) {
//     console.error('Error getting orders:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error getting orders',
//       error: error.message
//     });
//   }
// };

// export const refundPayment = async (req, res) => {
//   try {
//     const { paymentId, amount, reason } = req.body;
    
//     // Create refund in Razorpay
//     const refund = await razorpay.payments.refund(paymentId, {
//       amount: amount * 100, // Convert to paise
//       notes: {
//         reason: reason || 'Customer request'
//       }
//     });
    
//     // Update order status
//     await Order.findOneAndUpdate(
//       { paymentId: paymentId },
//       { 
//         status: 'refunded',
//         refundId: refund.id,
//         refundedAt: new Date()
//       }
//     );
    
//     res.status(200).json({
//       success: true,
//       refund: refund
//     });
//   } catch (error) {
//     console.error('Error processing refund:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error processing refund',
//       error: error.message
//     });
//   }
// };




































// // // controllers/paymentController.js
// // import Razorpay from 'razorpay';
// // import crypto from 'crypto';
// // import Order from '../models/Order.js';
// // import Booking from '../models/Booking.js';
// // import Availability from '../models/Availability.js';

// // // Initialize Razorpay instance
// // const razorpay = new Razorpay({
// //   key_id: process.env.RAZORPAY_KEY_ID,
// //   key_secret: process.env.RAZORPAY_SECRET_KEY,
// // });

// // // Invoice calculation function - backend validation
// // const calculateInvoice = (cartData, studioHours = 0, studioPrice = 0) => {
// //   try {
// //     // Calculate individual totals
// //     const servicesTotal = cartData.services?.reduce((sum, item) => sum + (item.price * item.count), 0) || 0;
// //     const equipmentsTotal = cartData.equipments?.reduce((sum, item) => sum + (item.price * item.count), 0) || 0;
// //     const packagesTotal = cartData.packages?.reduce((sum, item) => sum + (item.price * item.count), 0) || 0;
// //     const helpersTotal = cartData.helpers?.reduce((sum, item) => sum + (item.price * item.count), 0) || 0;
    
// //     // Studio cost
// //     const studioTotal = studioPrice * studioHours;
    
// //     // Calculate subtotal
// //     const subtotal = studioTotal + servicesTotal + equipmentsTotal + packagesTotal + helpersTotal;
    
// //     // Calculate GST (18%)
// //     const gstRate = 18;
// //     const gstAmount = (subtotal * gstRate) / 100;
    
// //     // Platform fee
// //     const platformFee = 500;
    
// //     // Calculate grand total
// //     const grandTotal = subtotal + gstAmount + platformFee;
    
// //     // Calculate advance and on-site amounts
// //     const advanceAmount = Math.round(grandTotal * 0.2); // 20%
// //     const onSiteAmount = grandTotal - advanceAmount; // 80%
    
// //     return {
// //       subtotal,
// //       gstAmount,
// //       platformFee,
// //       grandTotal,
// //       advanceAmount,
// //       onSiteAmount,
// //       breakdown: {
// //         studioTotal,
// //         servicesTotal,
// //         equipmentsTotal,
// //         packagesTotal,
// //         helpersTotal
// //       }
// //     };
// //   } catch (error) {
// //     console.error('Error calculating invoice:', error);
// //     throw new Error('Invoice calculation failed');
// //   }
// // };

// // export const createOrder = async (req, res) => {
// //   try {
// //     const { 
// //       amount, 
// //       currency = 'INR', 
// //       paymentType = 'advance',
// //       userId,
// //       cartData,
// //       bookingDates,
// //       entityInfo,
// //       frontendInvoice
// //     } = req.body;
    
// //     // Validate required fields
// //     if (!amount || !userId || !cartData) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Amount, userId, and cartData are required'
// //       });
// //     }
    
// //     // Extract entity info
// //     const entityType = entityInfo?.entityType;
// //     const entityId = entityType === 'studio' 
// //       ? entityInfo?.studio?._id 
// //       : entityInfo?.freelancer?._id;
    
// //     if (!entityId || !entityType) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Entity information is required'
// //       });
// //     }
    
// //     // Check availability before creating booking
// //     const availabilityCheck = await checkAndReserveAvailability(
// //       bookingDates, 
// //       entityType, 
// //       entityId, 
// //       userId
// //     );
    
// //     if (!availabilityCheck.success) {
// //       return res.status(400).json({
// //         success: false,
// //         message: availabilityCheck.message
// //       });
// //     }
    
// //     // Get studio/freelancer pricing
// //     let studioPrice = 0;
// //     if (entityType === 'studio') {
// //       studioPrice = entityInfo.studio?.pricePerHour || 0;
// //     } else if (entityType === 'freelancer') {
// //       studioPrice = entityInfo.freelancer?.pricePerHour || 0;
// //     }
    
// //     // Calculate studio hours from booking dates
// //     let studioHours = 0;
// //     if (bookingDates && Object.keys(bookingDates).length > 0) {
// //       studioHours = Object.values(bookingDates).reduce((total, booking) => {
// //         return total + (booking.endTime - booking.startTime);
// //       }, 0);
// //     }
    
// //     // Calculate invoice on backend
// //     const backendInvoice = calculateInvoice(cartData, studioHours, studioPrice);
    
// //     // Validate against frontend calculation
// //     if (frontendInvoice) {
// //       const tolerance = 1; // Allow 1 rupee difference due to rounding
// //       if (Math.abs(backendInvoice.grandTotal - frontendInvoice.grandTotal) > tolerance) {
// //         return res.status(400).json({
// //           success: false,
// //           message: 'Invoice calculation mismatch between frontend and backend',
// //           backendTotal: backendInvoice.grandTotal,
// //           frontendTotal: frontendInvoice.grandTotal
// //         });
// //       }
// //     }
    
// //     // Determine payment amount based on type
// //     const paymentAmount = paymentType === 'advance' 
// //       ? backendInvoice.advanceAmount 
// //       : backendInvoice.grandTotal;
    
// //     // Validate requested amount matches calculated amount
// //     if (Math.abs(amount - paymentAmount) > 1) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Payment amount mismatch',
// //         expected: paymentAmount,
// //         received: amount
// //       });
// //     }
    
// //     // Create booking with all data
// //     const booking = await createBookingFromReduxData(
// //       cartData, 
// //       bookingDates, 
// //       userId, 
// //       entityType, 
// //       entityId, 
// //       backendInvoice
// //     );
    
// //     // Create Razorpay order
// //     const razorpayOrder = await razorpay.orders.create({
// //       amount: paymentAmount * 100, // Convert to paise
// //       currency: currency,
// //       payment_capture: 1,
// //       notes: {
// //         bookingId: booking._id.toString(),
// //         paymentType: paymentType,
// //         userId: userId
// //       }
// //     });
    
// //     // Create order record
// //     const order = await Order.create({
// //       orderId: razorpayOrder.id,
// //       bookingId: booking._id,
// //       amount: paymentAmount,
// //       currency: currency,
// //       paymentType: paymentType,
// //       status: 'created'
// //     });
    
// //     res.status(200).json({ 
// //       success: true, 
// //       order: razorpayOrder,
// //       orderRecord: order,
// //       booking: booking._id,
// //       calculatedInvoice: backendInvoice
// //     });
// //   } catch (error) {
// //     console.error('Error creating order:', error);
// //     res.status(500).json({ 
// //       success: false, 
// //       message: 'Error creating order',
// //       error: error.message 
// //     });
// //   }
// // };

// // export const verifyPayment = async (req, res) => {
// //   try {
// //     const { 
// //       transactionId, 
// //       orderId, 
// //       signature
// //     } = req.body;
    
// //     // Validate required fields
// //     if (!transactionId || !orderId || !signature) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Transaction ID, Order ID, and signature are required'
// //       });
// //     }
    
// //     // Create signature string
// //     const sign = transactionId + "|" + orderId;
    
// //     // Generate expected signature
// //     const expectedSign = crypto
// //       .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
// //       .update(sign.toString())
// //       .digest("hex");
    
// //     if (signature === expectedSign) {
// //       // Payment verified successfully
// //       const updatedOrder = await Order.findOneAndUpdate(
// //         { orderId: orderId },
// //         { 
// //           status: 'paid',
// //           paymentId: transactionId,
// //           signature: signature,
// //           paidAt: new Date()
// //         },
// //         { new: true }
// //       ).populate('bookingId');
      
// //       if (!updatedOrder) {
// //         return res.status(404).json({
// //           success: false,
// //           message: 'Order not found'
// //         });
// //       }
      
// //       // Update booking status
// //       await Booking.findByIdAndUpdate(
// //         updatedOrder.bookingId._id,
// //         { 
// //           status: 'confirmed', 
// //           updatedAt: new Date() 
// //         }
// //       );
      
// //       // CONFIRM THE AVAILABILITY BOOKINGS
// //       await confirmAvailabilityBookings(
// //         updatedOrder.bookingId.bookingDates,
// //         updatedOrder.bookingId.entityType,
// //         updatedOrder.bookingId.entityId,
// //         updatedOrder.bookingId.userId
// //       );
      
// //       res.status(200).json({ 
// //         success: true, 
// //         message: 'Payment verified successfully',
// //         order: updatedOrder,
// //         paymentId: transactionId
// //       });
// //     } else {
// //       // Invalid signature
// //       const order = await Order.findOneAndUpdate(
// //         { orderId: orderId },
// //         { 
// //           status: 'failed',
// //           signature: signature,
// //           failedAt: new Date()
// //         },
// //         { new: true }
// //       ).populate('bookingId');
      
// //       if (order && order.bookingId) {
// //         // Cancel booking
// //         await Booking.findByIdAndUpdate(
// //           order.bookingId._id,
// //           { 
// //             status: 'cancelled',
// //             updatedAt: new Date()
// //           }
// //         );
        
// //         // RELEASE THE RESERVED AVAILABILITY
// //         await releaseAvailabilityBookings(
// //           order.bookingId.bookingDates,
// //           order.bookingId.entityType,
// //           order.bookingId.entityId,
// //           order.bookingId.userId
// //         );
// //       }
      
// //       res.status(400).json({ 
// //         success: false, 
// //         message: 'Payment verification failed - Invalid signature' 
// //       });
// //     }
// //   } catch (error) {
// //     console.error('Error verifying payment:', error);
// //     res.status(500).json({ 
// //       success: false, 
// //       message: 'Error verifying payment',
// //       error: error.message 
// //     });
// //   }
// // };

// // export const getPaymentStatus = async (req, res) => {
// //   try {
// //     const { orderId } = req.params;
    
// //     const order = await Order.findOne({ orderId })
// //       .populate('bookingId');
    
// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Order not found'
// //       });
// //     }
    
// //     res.status(200).json({
// //       success: true,
// //       order: order
// //     });
// //   } catch (error) {
// //     console.error('Error getting payment status:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Error getting payment status',
// //       error: error.message
// //     });
// //   }
// // };

// // // Helper function to check and reserve availability
// // const checkAndReserveAvailability = async (bookingDates, entityType, entityId, userId) => {
// //   try {
// //     for (const [dateStr, bookingData] of Object.entries(bookingDates)) {
// //       const date = new Date(dateStr);
      
// //       // Find availability for this date
// //       const query = { date };
// //       if (entityType === 'studio') {
// //         query.studioId = entityId;
// //       } else {
// //         query.freelancerId = entityId;
// //       }
      
// //       let availability = await Availability.findOne(query);
      
// //       if (!availability) {
// //         return {
// //           success: false,
// //           message: `No availability found for ${dateStr}`
// //         };
// //       }
      
// //       // Check if the requested time slots are available
// //       for (let hour = bookingData.startTime; hour < bookingData.endTime; hour++) {
// //         const timeSlot = availability.timeSlots.find(slot => {
// //           const slotHour = parseInt(slot.startTime.split(':')[0]);
// //           return slotHour === hour;
// //         });
        
// //         if (!timeSlot || !timeSlot.isAvailable) {
// //           return {
// //             success: false,
// //             message: `Time slot ${hour}:00 is not available on ${dateStr}`
// //           };
// //         }
// //       }
      
// //       // Reserve the slots (mark as pending in availability)
// //       await Availability.findByIdAndUpdate(availability._id, {
// //         $push: {
// //           bookings: {
// //             slotStartTime: `${bookingData.startTime}:00`,
// //             slotEndTime: `${bookingData.endTime}:00`,
// //             userId: userId,
// //             status: 'pending'
// //           }
// //         }
// //       });
      
// //       // Update time slots to unavailable
// //       await updateTimeSlotsAvailability(
// //         availability._id,
// //         bookingData.startTime,
// //         bookingData.endTime,
// //         false
// //       );
// //     }
    
// //     return { success: true };
// //   } catch (error) {
// //     console.error('Error checking availability:', error);
// //     return {
// //       success: false,
// //       message: 'Error checking availability'
// //     };
// //   }
// // };

// // // Helper function to confirm availability bookings after payment
// // const confirmAvailabilityBookings = async (bookingDates, entityType, entityId, userId) => {
// //   try {
// //     for (const booking of bookingDates) {
// //       const query = { date: booking.date };
// //       if (entityType === 'studio') {
// //         query.studioId = entityId;
// //       } else {
// //         query.freelancerId = entityId;
// //       }
      
// //       // Update booking status from pending to confirmed
// //       await Availability.findOneAndUpdate(
// //         {
// //           ...query,
// //           'bookings.userId': userId,
// //           'bookings.status': 'pending',
// //           'bookings.slotStartTime': `${booking.startTime}:00`,
// //           'bookings.slotEndTime': `${booking.endTime}:00`
// //         },
// //         {
// //           $set: {
// //             'bookings.$.status': 'confirmed'
// //           }
// //         }
// //       );
// //     }
// //   } catch (error) {
// //     console.error('Error confirming availability bookings:', error);
// //   }
// // };

// // // Helper function to release availability bookings if payment fails
// // const releaseAvailabilityBookings = async (bookingDates, entityType, entityId, userId) => {
// //   try {
// //     for (const booking of bookingDates) {
// //       const query = { date: booking.date };
// //       if (entityType === 'studio') {
// //         query.studioId = entityId;
// //       } else {
// //         query.freelancerId = entityId;
// //       }
      
// //       // Remove the booking from availability
// //       await Availability.findOneAndUpdate(
// //         query,
// //         {
// //           $pull: {
// //             bookings: {
// //               userId: userId,
// //               slotStartTime: `${booking.startTime}:00`,
// //               slotEndTime: `${booking.endTime}:00`
// //             }
// //           }
// //         }
// //       );
      
// //       // Mark time slots as available again
// //       const availability = await Availability.findOne(query);
// //       if (availability) {
// //         await updateTimeSlotsAvailability(
// //           availability._id,
// //           booking.startTime,
// //           booking.endTime,
// //           true
// //         );
// //       }
// //     }
// //   } catch (error) {
// //     console.error('Error releasing availability bookings:', error);
// //   }
// // };

// // // Helper function to update time slots availability
// // const updateTimeSlotsAvailability = async (availabilityId, startTime, endTime, isAvailable) => {
// //   try {
// //     const availability = await Availability.findById(availabilityId);
    
// //     for (let hour = startTime; hour < endTime; hour++) {
// //       const slotIndex = availability.timeSlots.findIndex(slot => {
// //         const slotHour = parseInt(slot.startTime.split(':')[0]);
// //         return slotHour === hour;
// //       });
      
// //       if (slotIndex !== -1) {
// //         availability.timeSlots[slotIndex].isAvailable = isAvailable;
// //       }
// //     }
    
// //     await availability.save();
// //   } catch (error) {
// //     console.error('Error updating time slots availability:', error);
// //   }
// // };

// // // Helper function to create booking from Redux data
// // const createBookingFromReduxData = async (
// //   cartData, 
// //   bookingDates, 
// //   userId, 
// //   entityType, 
// //   entityId, 
// //   calculatedInvoice
// // ) => {
// //   try {
// //     // Convert bookingDates object to array
// //     const bookingDatesArray = Object.entries(bookingDates || {}).map(([date, booking]) => ({
// //       date: new Date(date),
// //       startTime: booking.startTime,
// //       endTime: booking.endTime,
// //       isWholeDay: booking.isWholeDay || false,
// //       slots: booking.slots || []
// //     }));
    
// //     // Prepare booking data
// //     const bookingData = {
// //       userId: userId,
// //       entityType: entityType,
// //       entityId: entityId,
      
// //       // Add specific fields based on entity type
// //       ...(entityType === 'studio' && { studioId: entityId }),
// //       ...(entityType === 'freelancer' && { freelancerId: entityId }),
      
// //       // Cart items (convert from Redux object format to array)
// //       services: Object.values(cartData.services || {}),
// //       equipments: Object.values(cartData.equipments || {}),
// //       packages: Object.values(cartData.packages || {}),
// //       helpers: Object.values(cartData.helpers || {}),
      
// //       // Booking dates
// //       bookingDates: bookingDatesArray,
      
// //       // Use backend calculated pricing
// //       subtotal: calculatedInvoice.subtotal,
// //       gstAmount: calculatedInvoice.gstAmount,
// //       platformFee: calculatedInvoice.platformFee,
// //       totalAmount: calculatedInvoice.grandTotal,
// //       advanceAmount: calculatedInvoice.advanceAmount,
// //       onSiteAmount: calculatedInvoice.onSiteAmount,
      
// //       // Initial status
// //       status: 'pending'
// //     };
    
// //     // CREATE THE BOOKING
// //     const booking = await Booking.create(bookingData);
// //     return booking;
// //   } catch (error) {
// //     console.error('Error creating booking:', error);
// //     throw error;
// //   }
// // };

// // export {
// //   createOrder,
// //   verifyPayment,
// //   getPaymentStatus
// // };


//15-05-new

// controllers/paymentController.js
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../../models/user/order.model.js';
import Booking from '../../models/user/booking.model.js';
import Service from '../../models/partner/service.model.js';
import Equipment from '../../models/partner/equipment.model.js';
import Package from '../../models/partner/package.model.js';
import Helper from '../../models/partner/helper.model.js';
import Availability from '../../models/partner/availability.model.js';
import Studio from '../../models/partner/studio.model.js';
import Freelancer from '../../models/partner/freelancer.model.js';
import mongoose from 'mongoose';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Function to check if slots are available (using dateDocumentId)
const checkSlotsAvailability = async (bookingDates) => {
  try {
    for (const [dateKey, booking] of Object.entries(bookingDates)) {
      // Use dateDocumentId directly if available
      if (!booking.dateDocumentId) {
        throw new Error(`Date document ID missing for ${dateKey}`);
      }
      
      // Find availability by ID directly
      const availability = await Availability.findById(booking.dateDocumentId);
      
      if (!availability) {
        throw new Error(`Availability document not found for ${dateKey}`);
      }
      
      // Check if all requested slots are available
      for (const slotId of booking.slots) {
        const slot = availability.timeSlots.find(
          slot => slot._id.toString() === slotId.toString()
        );
        
        if (!slot) {
          throw new Error(`Slot ${slotId} not found for ${dateKey}`);
        }
        
        if (!slot.isAvailable) {
          throw new Error(`Slot ${slotId} is not available for ${dateKey}`);
        }
        
        // Check if slot is already booked in the availability document
        const existingBooking = availability.bookings.find(booking => 
          booking.slotStartTime === slot.startTime && 
          booking.slotEndTime === slot.endTime &&
          booking.status !== 'cancelled'
        );
        
        if (existingBooking) {
          throw new Error(`Slot ${slot.startTime}-${slot.endTime} is already booked for ${dateKey}`);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error checking slot availability:', error);
    throw error;
  }
};

// Function to update availability after booking
const updateAvailabilityAfterBooking = async (bookingDates, userId, bookingStatus = 'confirmed') => {
  try {
    for (const [dateKey, booking] of Object.entries(bookingDates)) {
      if (!booking.dateDocumentId) {
        console.warn(`Date document ID missing for ${dateKey}`);
        continue;
      }
      
      // Find availability by ID directly
      const availability = await Availability.findById(booking.dateDocumentId);
      
      if (!availability) {
        console.warn(`Availability document not found for ${dateKey} during update`);
        continue;
      }
      
      // Update each booked slot
      for (const slotId of booking.slots) {
        const slotIndex = availability.timeSlots.findIndex(
          slot => slot._id.toString() === slotId.toString()
        );
        
        if (slotIndex !== -1) {
          const slot = availability.timeSlots[slotIndex];
          
          // Mark slot as unavailable
          availability.timeSlots[slotIndex].isAvailable = false;
          
          // Add booking entry to the availability document
          availability.bookings.push({
            slotStartTime: slot.startTime,
            slotEndTime: slot.endTime,
            userId: userId,
            status: bookingStatus,
            bookingDateTime: new Date()
          });
        }
      }
      
      // Check if all slots are now booked (optional)
      const allSlotsBooked = availability.timeSlots.every(slot => !slot.isAvailable);
      availability.isFullyBooked = allSlotsBooked;
      
      // Save the updated availability
      await availability.save();
    }
    
    return true;
  } catch (error) {
    console.error('Error updating availability:', error);
    throw error;
  }
};

// Function to release slots (in case of cancellation or failed payment)
const releaseSlotsAvailability = async (bookingDates, userId) => {
  try {
    for (const [dateKey, booking] of Object.entries(bookingDates)) {
      if (!booking.dateDocumentId) {
        console.warn(`Date document ID missing for ${dateKey}`);
        continue;
      }
      
      // Find availability by ID directly
      const availability = await Availability.findById(booking.dateDocumentId);
      
      if (!availability) {
        console.warn(`Availability document not found for ${dateKey} during release`);
        continue;
      }
      
      // Release each slot
      for (const slotId of booking.slots) {
        const slotIndex = availability.timeSlots.findIndex(
          slot => slot._id.toString() === slotId.toString()
        );
        
        if (slotIndex !== -1) {
          // Mark slot as available again
          availability.timeSlots[slotIndex].isAvailable = true;
          
          // Remove or mark booking as cancelled
          availability.bookings = availability.bookings.map(booking => {
            if (booking.userId.toString() === userId.toString() && 
                booking.slotStartTime === availability.timeSlots[slotIndex].startTime) {
              return { ...booking, status: 'cancelled' };
            }
            return booking;
          });
        }
      }
      
      // Update isFullyBooked status
      availability.isFullyBooked = false;
      
      // Save the updated availability
      await availability.save();
    }
    
    return true;
  } catch (error) {
    console.error('Error releasing slots:', error);
    throw error;
  }
};

const calculateInvoice = async (cartData, entityHours = 0, entityPrice = 0) => {
  try {

    console.log(entityHours,"eehh",entityPrice);
    

    console.log(cartData, "cartData received");
    
    // Extract IDs from your cart data structure
    const serviceIds = Object.keys(cartData.services || {});
    const equipmentIds = Object.keys(cartData.equipments || {});
    const packageIds = Object.keys(cartData.packages || {});
    const helperIds = Object.keys(cartData.helpers || {});
    
    console.log('IDs extracted:', {
      serviceIds,
      equipmentIds,
      packageIds,
      helperIds
    });
    
    // Batch fetch all items
    const [services, equipments, packages, helpers] = await Promise.all([
      Service.find({ _id: { $in: serviceIds } }),
      Equipment.find({ _id: { $in: equipmentIds } }),
      Package.find({ _id: { $in: packageIds } }),
      Helper.find({ _id: { $in: helperIds } })
    ]);
    
    // Create lookup maps
    const serviceMap = services.reduce((map, service) => {
      map[service._id.toString()] = service;
      return map;
    }, {});
    
    const equipmentMap = equipments.reduce((map, equipment) => {
      map[equipment._id.toString()] = equipment;
      return map;
    }, {});
    
    const packageMap = packages.reduce((map, pkg) => {
      map[pkg._id.toString()] = pkg;
      return map;
    }, {});
    
    const helperMap = helpers.reduce((map, helper) => {
      map[helper._id.toString()] = helper;
      return map;
    }, {});
    
    // Calculate totals using your cart structure
    const servicesTotal = Object.entries(cartData.services || {}).reduce((sum, [id, { count }]) => {
      const service = serviceMap[id];
      if (!service) {
        console.warn(`Service not found for ID: ${id}`);
        return sum;
      }
      return sum + (service.price * count);
    }, 0);
    
    const equipmentsTotal = Object.entries(cartData.equipments || {}).reduce((sum, [id, { count }]) => {
      const equipment = equipmentMap[id];
      if (!equipment) {
        console.warn(`Equipment not found for ID: ${id}`);
        return sum;
      }
      return sum + (equipment.price * count);
    }, 0);
    
    const packagesTotal = Object.entries(cartData.packages || {}).reduce((sum, [id, { count }]) => {
      const packages = packageMap[id];
      if (!packages) {
        console.warn(`Package not found for ID: ${id}`);
        return sum;
      }
      return sum + (packages.price * count);
    }, 0);
    
    const helpersTotal = Object.entries(cartData.helpers || {}).reduce((sum, [id, { count }]) => {
      const helper = helperMap[id];
      if (!helper) {
        console.warn(`Helper not found for ID: ${id}`);
        return sum;
      }
      return sum + (helper.price * count);
    }, 0);
    
    console.log('Calculated totals:', {
      servicesTotal,
      equipmentsTotal,
      packagesTotal,
      helpersTotal
    });
    
    // Studio cost
    const studioTotal = entityPrice * entityHours;

    console.log(studioTotal,"1475 st");
    
    
    // Calculate subtotal
    const subtotal = studioTotal + servicesTotal + equipmentsTotal + packagesTotal + helpersTotal;
    
    // Calculate GST (18%)
    const gstRate = 18;
    const gstAmount = (subtotal * gstRate) / 100;
    
    // Platform fee
    const platformFee = 500;
    
    // Calculate grand total
    const grandTotal = subtotal + gstAmount + platformFee;
    
    // Calculate advance and on-site amounts
    const advanceAmount = Math.round(grandTotal * 0.2); // 20%
    const onSiteAmount = grandTotal - advanceAmount; // 80%
    
    return {
      subtotal,
      gstAmount,
      platformFee,
      grandTotal,
      advanceAmount,
      onSiteAmount,
      breakdown: {
        studioTotal,
        servicesTotal,
        equipmentsTotal,
        packagesTotal,
        helpersTotal
      }
    };
  } catch (error) {
    console.error('Error calculating invoice:', error);
    throw new Error('Invoice calculation failed');
  }
};

// Updated createBookingFromReduxData function
// const createBookingFromReduxData = async (
//   cartData, 
//   bookingDates, 
//   userId, 
//   entityType, 
//   entityId, 
//   calculatedInvoice
// ) => {
//   try {
//     // Convert bookingDates object to array
//     const bookingDatesArray = Object.entries(bookingDates || {}).map(([date, booking]) => ({
//       date: new Date(date),
//       startTime: booking.startTime,
//       endTime: booking.endTime,
//       isWholeDay: booking.isWholeDay || false,
//       dateDocumentId: booking.dateDocumentId ? new mongoose.Types.ObjectId(booking.dateDocumentId) : null,
//       slots: (booking.slots || []).map(slotId => 
//         typeof slotId === 'string' ? new mongoose.Types.ObjectId(slotId) : slotId
//       )
//     }));
    
//     // Fetch full item details for booking storage
//     const serviceIds = Object.keys(cartData.services || {});
//     const equipmentIds = Object.keys(cartData.equipments || {});
//     const packageIds = Object.keys(cartData.packages || {});
//     const helperIds = Object.keys(cartData.helpers || {});
    
//     const [services, equipments, packages, helpers] = await Promise.all([
//       Service.find({ _id: { $in: serviceIds } }),
//       Equipment.find({ _id: { $in: equipmentIds } }),
//       Package.find({ _id: { $in: packageIds } }),
//       Helper.find({ _id: { $in: helperIds } })
//     ]);
    
//     // Convert to booking format with full details
//     const servicesForBooking = services.map(service => ({
//       serviceId: service._id,
//       name: service.name,
//       price: service.price,
//       count: cartData.services[service._id.toString()].count
//     }));
    
//     const equipmentsForBooking = equipments.map(equipment => ({
//       equipmentId: equipment._id,
//       name: equipment.name,
//       price: equipment.price,
//       count: cartData.equipments[equipment._id.toString()].count
//     }));
    
//     const packagesForBooking = packages.map(pkg => ({
//       packageId: pkg._id,
//       name: pkg.name,
//       price: pkg.price,
//       count: cartData.packages[pkg._id.toString()].count
//     }));
    
//     const helpersForBooking = helpers.map(helper => ({
//       helperId: helper._id,
//       name: helper.name,
//       price: helper.price,
//       count: cartData.helpers[helper._id.toString()].count
//     }));
    
//     // Prepare booking data
//     const bookingData = {
//       userId: userId,
//       entityType: entityType,
//       entityId: entityId,
      
//       // Add specific fields based on entity type
//       ...(entityType === 'studio' && { studioId: entityId }),
//       ...(entityType === 'freelancer' && { freelancerId: entityId }),
      
//       // Cart items with full details
//       services: servicesForBooking,
//       equipments: equipmentsForBooking,
//       packages: packagesForBooking,
//       helpers: helpersForBooking,
      
//       // Booking dates
//       bookingDates: bookingDatesArray,
      
//       // Use backend calculated pricing
//       subtotal: calculatedInvoice.subtotal,
//       gstAmount: calculatedInvoice.gstAmount,
//       platformFee: calculatedInvoice.platformFee,
//       totalAmount: calculatedInvoice.grandTotal,
//       advanceAmount: calculatedInvoice.advanceAmount,
//       onSiteAmount: calculatedInvoice.onSiteAmount,
      
//       // Initial status
//       status: 'pending'
//     };
    
//     // CREATE THE BOOKING
//     const booking = await Booking.create(bookingData);
//     return booking;
//   } catch (error) {
//     console.error('Error creating booking:', error);
//     throw error;
//   }
// };

// Updated createBookingFromReduxData function - More contextual payment fields
const createBookingFromReduxData = async (
    cartData, 
    bookingDates, 
    userId, 
    entityType, 
    entityId, 
    calculatedInvoice,
    paymentType = 'advance'
  ) => {

    console.log(paymentType,"pppppppppppttttttttttttttttttt");
    

    try {
      // Convert bookingDates object to array
      const bookingDatesArray = Object.entries(bookingDates || {}).map(([date, booking]) => ({
        date: new Date(date),
        startTime: booking.startTime,
        endTime: booking.endTime,
        isWholeDay: booking.isWholeDay || false,
        dateDocumentId: booking.dateDocumentId ? new mongoose.Types.ObjectId(booking.dateDocumentId) : null,
        slots: (booking.slots || []).map(slotId => 
          typeof slotId === 'string' ? new mongoose.Types.ObjectId(slotId) : slotId
        )
      }));
      
      // Fetch full item details for booking storage
      const serviceIds = Object.keys(cartData.services || {});
      const equipmentIds = Object.keys(cartData.equipments || {});
      const packageIds = Object.keys(cartData.packages || {});
      const helperIds = Object.keys(cartData.helpers || {});
      
      const [services, equipments, packages, helpers] = await Promise.all([
        Service.find({ _id: { $in: serviceIds } }),
        Equipment.find({ _id: { $in: equipmentIds } }),
        Package.find({ _id: { $in: packageIds } }),
        Helper.find({ _id: { $in: helperIds } })
      ]);
      
      // Convert to booking format with full details
      const servicesForBooking = services.map(service => ({
        serviceId: service._id,
        name: service.name,
        price: service.price,
        count: cartData.services[service._id.toString()].count
      }));
      
      const equipmentsForBooking = equipments.map(equipment => ({
        equipmentId: equipment._id,
        name: equipment.name,
        price: equipment.price,
        count: cartData.equipments[equipment._id.toString()].count
      }));
      
      const packagesForBooking = packages.map(pkg => ({
        packageId: pkg._id,
        name: pkg.name,
        price: pkg.price,
        count: cartData.packages[pkg._id.toString()].count
      }));
      
      const helpersForBooking = helpers.map(helper => ({
        helperId: helper._id,
        name: helper.name,
        price: helper.price,
        count: cartData.helpers[helper._id.toString()].count
      }));
      
      // Calculate payment amounts based on payment type
      let totalPaid = 0;
      let pendingAmount = 0;
      let paymentStatus = 'pending';
      let advanceAmount = null;
      let onSiteAmount = null;
      
      if (paymentType === 'full') {
        // For full payment, user pays the entire amount
        totalPaid = calculatedInvoice.grandTotal;
        pendingAmount = 0;
        paymentStatus = 'completed';
        // Don't set advanceAmount and onSiteAmount for full payments
        // They remain null to indicate full payment was made
      } else {
        // For advance payment, user pays only the advance amount
        totalPaid = calculatedInvoice.advanceAmount;
        pendingAmount = calculatedInvoice.onSiteAmount;
        paymentStatus = 'partial';
        // Only set these fields for advance payments
        advanceAmount = calculatedInvoice.advanceAmount;
        onSiteAmount = calculatedInvoice.onSiteAmount;
      }
      
      // Prepare booking data - conditionally include advance/onsite amounts
      const bookingData = {
        userId: userId,
        entityType: entityType,
        entityId: entityId,
        
        // Add specific fields based on entity type
        ...(entityType === 'studio' && { studioId: entityId }),
        ...(entityType === 'freelancer' && { freelancerId: entityId }),
        
        // Cart items with full details
        services: servicesForBooking,
        equipments: equipmentsForBooking,
        packages: packagesForBooking,
        helpers: helpersForBooking,
        
        // Booking dates
        bookingDates: bookingDatesArray,
        
        // Use backend calculated pricing
        subtotal: calculatedInvoice.subtotal,
        gstAmount: calculatedInvoice.gstAmount,
        platformFee: calculatedInvoice.platformFee,
        totalAmount: calculatedInvoice.grandTotal,
        
        // Only include advanceAmount and onSiteAmount if it's an advance payment
        ...(paymentType === 'advance' && { 
          advanceAmount: advanceAmount,
          onSiteAmount: onSiteAmount 
        }),
        
        // Payment tracking fields
        totalPaid: totalPaid,
        pendingAmount: pendingAmount,
        paymentStatus: paymentStatus,
        initialPaymentType: paymentType, // Track the initial payment type
        
        // Initialize payment history with the initial payment
        paymentHistory: [{
          amount: totalPaid,
          paymentMethod: 'online',
          paymentType: paymentType,
          paymentDate: new Date(),
          paidBy: 'customer',
          notes: `Initial ${paymentType} payment via Razorpay`
        }],
        
        // Initial status
        status: 'pending'
      };
      
      // CREATE THE BOOKING
      const booking = await Booking.create(bookingData);
      return booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };



export const createOrder = async (req, res) => {
  try {
    console.log(req.user._id, "uid");
    console.log(req.body, "rbd---------rbd");

    const userId = req.user._id;

    const { 
      amount, 
      currency = 'INR', 
      paymentType = 'advance',
      cartData,
      bookingDates,
      entityInfo,
      frontendInvoice
    } = req.body;
    
    


    // Validate required fields
    if (!amount || !userId || !cartData) {
      return res.status(400).json({
        success: false,
        message: 'Amount, userId, and cartData are required'
      });
    }
    
    // Extract entity info
    const entityType = entityInfo?.entityType;
    const entityId = entityType === 'studio' 
      ? entityInfo?.studio?._id 
      : entityInfo?.freelancer?._id;
    
    if (!entityId || !entityType) {
      return res.status(400).json({
        success: false,
        message: 'Entity information is required'
      });
    }
let freelancerData
let studioData

    if(entityType==="studio"){
      studioData = await Studio.findById(entityId)
    }else if (entityType === "freelancer"){
      freelancerData = await Freelancer.findById(entityId)
    }

    console.log(freelancerData,studioData,"=============={{{{{{{{{{{{{{{{");
    
    
    // Check slot availability (simplified - no need to pass entity info)
    try {
      await checkSlotsAvailability(bookingDates);
    } catch (availabilityError) {
      return res.status(400).json({
        success: false,
        message: 'Slot availability check failed',
        error: availabilityError.message
      });
    }
    

    console.log(entityInfo,"ingor  1832============");
    

    // Get studio/freelancer pricing
    let entityPrice = 0;
    if (entityType === 'studio') {
      entityPrice = studioData?.pricePerHour || 0;
    } else if (entityType === 'freelancer') {
      entityPrice = freelancerData?.pricePerHour || 0;
    }
    
    // Calculate entity hours from booking dates
    let entityHours = 0;
    if (bookingDates && Object.keys(bookingDates).length > 0) {
      entityHours = Object.values(bookingDates).reduce((total, booking) => {
        return total + (booking.endTime - booking.startTime);
      }, 0);
    }
    
    // Calculate invoice on backend
    const backendInvoice = await calculateInvoice(cartData, entityHours, entityPrice);
    console.log(backendInvoice, "backendInvoice calculated");
    
    // Validate against frontend calculation
    if (frontendInvoice) {
      const tolerance = 1; // Allow 1 rupee difference due to rounding
      if (Math.abs(backendInvoice.grandTotal - frontendInvoice.grandTotal) > tolerance) {
        return res.status(400).json({
          success: false,
          message: 'Invoice calculation mismatch between frontend and backend',
          backendTotal: backendInvoice.grandTotal,
          frontendTotal: frontendInvoice.grandTotal
        });
      }
    }
    
    // Determine payment amount based on type
    const paymentAmount = paymentType === 'advance' 
      ? backendInvoice.advanceAmount 
      : backendInvoice.grandTotal;
    
    console.log(paymentAmount, "paymentAmount calculated");
    
    // Validate requested amount matches calculated amount
    if (Math.abs(amount - paymentAmount) > 1) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount mismatch',
        expected: paymentAmount,
        received: amount
      });
    }
    
    // Create booking with all data
    const booking = await createBookingFromReduxData(
      cartData, 
      bookingDates, 
      userId, 
      entityType, 
      entityId, 
      backendInvoice,
      paymentType  
    );
    
    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(paymentAmount * 100),
      // amount: paymentAmount * 100, // Convert to paise
      currency: currency,
      payment_capture: 1,
      notes: {
        bookingId: booking._id.toString(),
        paymentType: paymentType,
        userId: userId
      }
    });
    
    // Create order record
    const order = await Order.create({
      orderId: razorpayOrder.id,
      bookingId: booking._id,
      amount: paymentAmount,
      currency: currency,
      paymentType: paymentType,
      status: 'created'
    });
    
    res.status(200).json({ 
      success: true, 
      order: razorpayOrder,
      orderRecord: order,
      booking: booking._id,
      calculatedInvoice: backendInvoice
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating order',
      error: error.message 
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { 
      transactionId, 
      orderId, 
      signature
    } = req.body;
    
    // Validate required fields
    if (!transactionId || !orderId || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID, Order ID, and signature are required'
      });
    }
    
    // Create signature string
    const sign = orderId + "|" + transactionId;
    
    // Generate expected signature
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(sign.toString())
      .digest("hex");
    
    console.log("Transaction ID:", transactionId);
    console.log("Order ID:", orderId);
    console.log("Sign string:", sign);
    console.log("Secret key exists:", !!process.env.RAZORPAY_SECRET_KEY);
    console.log("Expected signature:", expectedSign);
    console.log("Received signature:", signature);

    if (signature === expectedSign) {
      // Payment verified successfully
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId: orderId },
        { 
          status: 'paid',
          paymentId: transactionId,
          signature: signature,
          paidAt: new Date()
        },
        { new: true }
      ).populate('bookingId');
      
      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      
      // Update booking status
      const updatedBooking = await Booking.findByIdAndUpdate(
        updatedOrder.bookingId._id,
        { 
          status: 'confirmed', 
          updatedAt: new Date() 
        },
        { new: true }
      );
      
      // Update availability after successful payment (simplified)
      try {
        const bookingDatesForUpdate = updatedBooking.bookingDates.reduce((acc, dateBooking) => {
          const dateKey = dateBooking.date.toISOString().split('T')[0];
          acc[dateKey] = {
            slots: dateBooking.slots.map(slot => slot.toString()),
            dateDocumentId: dateBooking.dateDocumentId?.toString()
          };
          return acc;
        }, {});
        
        await updateAvailabilityAfterBooking(
          bookingDatesForUpdate,
          updatedBooking.userId,
          'confirmed'
        );
        console.log('Availability updated successfully after payment');
      } catch (availabilityError) {
        console.error('Error updating availability after payment:', availabilityError);
        // Don't fail the payment verification, but log the error
      }
      
      res.status(200).json({ 
        success: true, 
        message: 'Payment verified successfully',
        order: updatedOrder,
        paymentId: transactionId
      });
    } else {
      // Invalid signature - Release the slots
      const order = await Order.findOneAndUpdate(
        { orderId: orderId },
        { 
          status: 'failed',
          signature: signature,
          failedAt: new Date()
        },
        { new: true }
      ).populate('bookingId');
      
      if (order && order.bookingId) {
        await Booking.findByIdAndUpdate(
          order.bookingId._id,
          { 
            status: 'cancelled',
            updatedAt: new Date()
          }
        );
        
        // Release slots on payment failure (simplified)
        try {
          const bookingDatesForRelease = order.bookingId.bookingDates.reduce((acc, dateBooking) => {
            const dateKey = dateBooking.date.toISOString().split('T')[0];
            acc[dateKey] = {
              slots: dateBooking.slots.map(slot => slot.toString()),
              dateDocumentId: dateBooking.dateDocumentId?.toString()
            };
            return acc;
          }, {});
          
          await releaseSlotsAvailability(
            bookingDatesForRelease,
            order.bookingId.userId
          );
          console.log('Slots released after payment failure');
        } catch (releaseError) {
          console.error('Error releasing slots after payment failure:', releaseError);
        }
      }
      
      res.status(400).json({ 
        success: false, 
        message: 'Payment verification failed - Invalid signature' 
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error verifying payment',
      error: error.message 
    });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({ orderId })
      .populate('bookingId');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      order: order
    });
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting payment status',
      error: error.message
    });
  }
};

export const getAllOrdersByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const orders = await Order.find({ bookingId })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting orders',
      error: error.message
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;
    
    // Find the booking
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if user owns the booking
    if (booking.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to cancel this booking'
      });
    }
    
    // Update booking status
    booking.status = 'cancelled';
    await booking.save();
    
    // Release the slots
    const bookingDatesForRelease = booking.bookingDates.reduce((acc, dateBooking) => {
      const dateKey = dateBooking.date.toISOString().split('T')[0];
      acc[dateKey] = {
        slots: dateBooking.slots.map(slot => slot.toString()),
        dateDocumentId: dateBooking.dateDocumentId?.toString()
      };
      return acc;
    }, {});
    
    await releaseSlotsAvailability(
      bookingDatesForRelease,
      booking.userId
    );
    
    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: booking
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

export const refundPayment = async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;
    
    // Create refund in Razorpay
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100, // Convert to paise
      notes: {
        reason: reason || 'Customer request'
      }
    });
    
    // Update order status
    await Order.findOneAndUpdate(
      { paymentId: paymentId },
      { 
        status: 'refunded',
        refundId: refund.id,
        refundedAt: new Date()
      }
    );
    
    res.status(200).json({
      success: true,
      refund: refund
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing refund',
      error: error.message
    });
  }
};