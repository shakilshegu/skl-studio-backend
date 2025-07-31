import { userInfo } from 'os';
import Cart from '../../models/cartModel.js';
import Studio from '../../models/partner/studio.Model.js';
import User from '../../models/userModel.js'; 


export const getDashboardMetrics = async (req, res) => {
  try {
    const matchStage = {
      paymentStatus: { $ne: 'pending' },
    };

   
    const [revenue, studiosCount, cities, customers] = await Promise.all([
      // Total Revenue
      Cart.aggregate([
        { $match: matchStage },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
      ]),

      // Total Studios
      Studio.countDocuments({ isDeleted: false }),

      // Total Cities
      Studio.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: '$address.city' } },
      ]),

      // Total Customers
      User.countDocuments({ roles: { $nin: ['super-admin', 'admin'] } }),
       
    ]);

    // Return all metrics in a single response
    res.status(200).json({
      totalRevenue: revenue[0]?.totalRevenue || 0,
      totalStudios: studiosCount,
      totalCities: cities.length,
      totalCustomers: customers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard metrics', error });
  }
};

export const getAllStudiosList = async (req, res) => {
  try {
   
    const { page = 1, limit = 10, search = '', city = '' } = req.query;

    // Calculate pagination values
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    // Create search criteria
  
    const searchCriteria = {
      isDeleted: false,
      ...(search && {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { studioEmail: { $regex: search, $options: 'i' } },
          { studioMobileNumber: { $regex: search, $options: 'i' } },
          { gstNumber: { $regex: search, $options: 'i' } },
          { 'address.addressLineOne': { $regex: search, $options: 'i' } },
          { 'address.addressLineTwo': { $regex: search, $options: 'i' } },
          { 'address.city': { $regex: search, $options: 'i' } },
        
          { 'owner.name': { $regex: search, $options: 'i' } },
          { 'owner.ownerEmail': { $regex: search, $options: 'i' } },
          { 'owner.ownerMobileNumber': { $regex: search, $options: 'i' } }
        ],
      }),
      ...(city && { 'address.city': city }),
    };


    // Fetch studios with pagination and search
    const studios = await Studio.find(searchCriteria)
      .skip(skip)
      .limit(pageSize);

    // Get total count of studios
    const totalStudios = await Studio.countDocuments(searchCriteria);

    res.status(200).json({
      totalStudios,
      totalPages: Math.ceil(totalStudios / pageSize),
      currentPage: pageNumber,
      studios,
    });
 
  } catch (error) {
    console.error('Error fetching studios list:', error);
    res.status(500).json({ message: 'An error occurred while fetching studios list', error: error.message });
  }
};

export const getRevenue = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year) {
      return res.status(400).json({ message: 'Year query parameter is required' });
    }

    const matchStage = {
      status: { $ne: 'pending' },
    };

    if (month) {
      // Calculate revenue for each day in a particular month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      matchStage.date = { $gte: startDate, $lte: endDate };

      const dailyRevenue = await Cart.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: { $dayOfMonth: '$date' },
            totalRevenue: { $sum: '$totalAmount' },
          },
        },
        { $sort: { '_id': 1 } },
        {
          $project: {
            day: '$_id',
            totalRevenue: 1,
            _id: 0
          }
        }
      ]);

      // Fill in missing days with 0 revenue
      const daysInMonth = new Date(year, month, 0).getDate();
      const dailyRevenueFilled = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const revenue = dailyRevenue.find(d => d.day === day);
        return {
          day,
          totalRevenue: revenue ? revenue.totalRevenue : 0
        };
      });

      res.status(200).json(dailyRevenueFilled);
    } else {
      // Calculate revenue for each month in a particular year
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

      matchStage.date = { $gte: startDate, $lte: endDate };

      const monthlyRevenue = await Cart.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: { $month: '$date' },
            totalRevenue: { $sum: '$totalAmount' },
          },
        },
        { $sort: { '_id': 1 } },
        {
          $project: {
            month: '$_id',
            totalRevenue: 1,
            _id: 0
          }
        }
      ]);

      // Fill in missing months with 0 revenue
      const monthlyRevenueFilled = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const revenue = monthlyRevenue.find(m => m.month === month);
        return {
          month,
          totalRevenue: revenue ? revenue.totalRevenue : 0
        };
      });

      res.status(200).json(monthlyRevenueFilled);
    }
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).json({ message: 'An error occurred while fetching revenue', error: error.message });
  }
};

export const getOrderCount = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year) {
      return res.status(400).json({ message: 'Year query parameter is required' });
    }

    const matchStage = {
      status: { $ne: 'pending' },
    };

    if (month) {
      // Calculate order count for each day in a particular month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      matchStage.date = { $gte: startDate, $lte: endDate };

      const dailyOrderCount = await Cart.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: { $dayOfMonth: '$date' },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { '_id': 1 } },
      ]);

      res.status(200).json(dailyOrderCount);
    } else {
      // Calculate order count for each month in a particular year
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

      matchStage.date = { $gte: startDate, $lte: endDate };

      const monthlyOrderCount = await Cart.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: { $month: '$date' },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { '_id': 1 } },
      ]);

      res.status(200).json(monthlyOrderCount);
    }
  } catch (error) {
    console.error('Error fetching order count:', error);
    res.status(500).json({ message: 'An error occurred while fetching order count', error: error.message });
  }
};

export const getOrdersList = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', city = '', fromDate, toDate } = req.query;

    // Calculate pagination values
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    // Create match criteria
    const matchCriteria = {
      status: { $ne: 'pending' },
      ...(fromDate && toDate && {
        date: { $gte: new Date(fromDate), $lte: new Date(toDate) },
      }),
    };

    if (city) {
      const studiosInCity = await Studio.find({ 'address.city': city }).select('_id');
      const studioIds = studiosInCity.map(studio => studio._id);
      matchCriteria.studio = { $in: studioIds };
    }

    if (search) {
      matchCriteria.$or = [
        { 'user.name': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } },
        { 'user.mobile': { $regex: search, $options: 'i' } },
      ];
    }

    // Fetch orders with pagination and search
    const orders = await Cart.find(matchCriteria)
      .populate('user', 'name email mobile')
      .populate('studio', 'name address.city')
      .skip(skip)
      .limit(pageSize);

    // Get total count of orders
    const totalOrders = await Cart.countDocuments(matchCriteria);

    res.status(200).json({
      totalOrders,
      totalPages: Math.ceil(totalOrders / pageSize),
      currentPage: pageNumber,
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders list:', error);
    res.status(500).json({ message: 'An error occurred while fetching orders list', error: error.message });
  }
};

export const approveStudio = async (req, res) => {
  try {
    const { studioId } = req.body;

    if (!studioId) {
      return res.status(400).json({ message: "studioId is required" });
    }

    const studio = await Studio.findByIdAndUpdate(
      studioId,
      { isVerified: true },
      { new: true }
    );

    if (!studio) {
      return res.status(404).json({ message: "Studio not found" });
    }

    res.status(200).json({ message: "Studio approved successfully", studio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while approving the studio", error });
  }
};

export const getAllStudiosDetailsWithCounts = async (req, res) => {
  try {
    const { page = 1, limit = 10, city = '', search = '' } = req.query;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Build the query object
    const query = {};
    if (city) {
      query['address.city'] = city;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studioEmail: { $regex: search, $options: 'i' } },
        { studioMobileNumber: { $regex: search, $options: 'i' } },
        
        { 'address.addressLineOne': { $regex: search, $options: 'i' } },
       
        { 'address.city': { $regex: search, $options: 'i' } },
        { 'address.state': { $regex: search, $options: 'i' } },
        
        { 'address.country': { $regex: search, $options: 'i' } },
        { 'owner.name': { $regex: search, $options: 'i' } },
        { 'owner.ownerMobileNumber': { $regex: search, $options: 'i' } },
        { 'type': { $regex: search, $options: 'i' } },
        { 'facilities': { $regex: search, $options: 'i' } },
      ];
    }

    // Get the total count of studios matching the query
    const totalStudios = await Studio.countDocuments(query);

    // Get the studios with pagination
    const studios = await Studio.find(query)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const studiosWithCounts = await Promise.all(studios.map(async (studio) => {
      const ordersCount = await Cart.countDocuments({ studio: studio._id , paymentStatus: { $ne: 'pending' } });
      const equipmentCount = studio.equipments ? studio.equipments.length : 0;
      const packagesCount = studio.packages ? studio.packages.length : 0;
      const servicesCount = studio.services ? studio.services.length : 0;

      // Calculate average rating
      const averageRating = studio.reviews.length > 0
        ? studio.reviews.reduce((acc, review) => acc + review.rating, 0) / studio.reviews.length
        : 0;

      return {
        studio,
        counts: {
          ordersCount,
          equipmentCount,
          packagesCount,
          servicesCount,
          averageRating
        }
      };
    }));

    res.status(200).json({
      totalStudios,
      totalPages: Math.ceil(totalStudios / limitNumber),
      currentPage: pageNumber,
      studios: studiosWithCounts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching studios details", error });
  }
};



// New controller to get all studios with isVerified status from req.params with pagination and search
export const getAllStudiosByVerificationStatus = async (req, res) => {
  try {
    const { isVerified } = req.params;
    const { page = 1, limit = 10, search = '' } = req.query;

    if (isVerified === undefined) {
      return res.status(400).json({ message: "isVerified parameter is required" });
    }

    const isVerifiedValue = isVerified === 'true';

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Build the query object
    const query = { isVerified: isVerifiedValue };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studioEmail: { $regex: search, $options: 'i' } },
        { studioMobileNumber: { $regex: search, $options: 'i' } },
        { 'owner.name': { $regex: search, $options: 'i' } },
        { 'owner.ownerEmail': { $regex: search, $options: 'i' } },
        { 'owner.ownerMobileNumber': { $regex: search, $options: 'i' } },
      ];
    }

    // Get the total count of studios matching the query
    const totalStudios = await Studio.countDocuments(query);

    // Get the studios with pagination
    const studios = await Studio.find(query)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.status(200).json({
      message: `Studios with isVerified=${isVerified} fetched successfully`,
      totalStudios,
      totalPages: Math.ceil(totalStudios / limitNumber),
      currentPage: pageNumber,
      studios
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching studios", error });
  }
};

export const getStudioBasicDetails = async (req, res) => {
  try {
    const { studioId } = req.params;

    if (!studioId) {
      return res.status(400).json({ message: "studioId is required" });
    }

    const studio = await Studio.findById(studioId).select('-createdAt -updatedAt -__v');

    if (!studio) {
      return res.status(404).json({ message: "Studio not found" });
    }

    res.status(200).json({ message: "Studio details fetched successfully", studio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching studio details", error });
  }
};

// New controller to get reviews of a studio with pagination and search
export const getStudioReviews = async (req, res) => {
  try {
    const { studioId } = req.params;
    const { page = 1, limit = 10, search = '' } = req.query;

    if (!studioId) {
      return res.status(400).json({ message: "studioId is required" });
    }

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Build the query object for reviews
    const query = { studio: studioId };
    if (search) {
      query.$or = [
        { 'reviews.comment': { $regex: search, $options: 'i' } },
        { 'reviews.rating': { $regex: search, $options: 'i' } },
        { 'reviews.user.name': { $regex: search, $options: 'i' } },
      ];
    }

    // Get the total count of reviews matching the query
    const totalReviews = await Studio.countDocuments(query);

    // Get the reviews with pagination
    const studio = await Studio.findById(studioId)
      .populate('reviews.user', 'name')
      .select('reviews')
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    if (!studio) {
      return res.status(404).json({ message: "Studio not found" });
    }

    const reviews = studio.reviews.map(review => ({
      userName: review.user.name,
      description: review.comment,
      date: review.createdAt,
      rating: review.rating
    }));

    res.status(200).json({
      totalReviews,
      totalPages: Math.ceil(totalReviews / limitNumber),
      currentPage: pageNumber,
      reviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching studio reviews", error });
  }
};


// New controller to get equipments, packages, and services based on studioId
export const getStudioResources = async (req, res) => {
  try {
    const { studioId } = req.params;

    if (!studioId) {
      return res.status(400).json({ message: "studioId is required" });
    }

    // Find the equipments, packages, and services by studioId, excluding reviews
    const equipments = await Equipment.find({ studioId, isDeleted: false }).select('-reviews');
    const packages = await Package.find({ studioId, isDeleted: false }).select('-reviews');
    const services = await Service.find({ studioId, isDeleted: false }).select('-reviews');

    res.status(200).json({
      message: "Studio resources fetched successfully",
      equipments,
      packages,
      services
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching studio resources", error });
  }
};


// New controller to get orders from CartModel based on studioId where paymentStatus is not equal to pending

// sample Request : 
// /studio/:studioId/orders
// studio/60d0fe4f5311236168a109cd/orders?page=1&limit=10

export const getOrdersByStudio = async (req, res) => {
  try {
    const { studioId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!studioId) {
      return res.status(400).json({ message: "studioId is required" });
    }

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Find orders where paymentStatus is not equal to pending
    const totalOrders = await Cart.countDocuments({ studio: studioId, paymentStatus: { $ne: 'pending' } });
    const orders = await Cart.find({ studio: studioId, paymentStatus: { $ne: 'pending' } })
      .populate('user', 'name email')
      .populate('equipments.id', 'name price')
      .populate('services.id', 'name price')
      .populate('packages.id', 'name price')
      .populate('slots', 'date')
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Format the response
    const formattedOrders = await Promise.all(orders.map(async order => {
      const slotDetails = await Slot.find({ _id: { $in: order.slots } }).select('date slots.startTime slots.endTime');
      const formattedSlots = slotDetails.map(slot => ({
        date: slot.date,
        times: slot.slots.map(s => ({
          startTime: s.startTime,
          endTime: s.endTime,
        })),
      }));

      // Get all equipments, services, and packages mentioned in the arrays
      const equipmentIds = order.equipments.map(e => e.id);
      const serviceIds = order.services.map(s => s.id);
      const packageIds = order.packages.map(p => p.id);

      const equipments = await Equipment.find({ _id: { $in: equipmentIds } });
      const services = await Service.find({ _id: { $in: serviceIds } });
      const packages = await Package.find({ _id: { $in: packageIds } });

      return {
        ...order.toObject(),
        slots: formattedSlots,
        equipments,
        services,
        packages,
      };
    }));

    res.status(200).json({
      message: "Orders fetched successfully",
      totalOrders,
      totalPages: Math.ceil(totalOrders / limitNumber),
      currentPage: pageNumber,
      orders: formattedOrders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching orders", error });
  }
};


// Sample Response :
// "message": "Orders fetched successfully",
// "totalOrders": 50,
// "totalPages": 5,
// "currentPage": 1,
// "orders": [
//   {
//     "_id": "60d0fe4f5311236168a109cc",
//     "user": {
//       "_id": "60d0fe4f5311236168a109ca",
//       "name": "John Doe",
//       "email": "johndoe@example.com"
//     },
//     "studio": "60d0fe4f5311236168a109cd",
//     "slotTiming": {
//       "startTime": "09:00",
//       "endTime": "11:00"
//     },
//     "equipments": [
//       {
//         "_id": "60d0fe4f5311236168a109ce",
//         "name": "Canon EOS 5D",
//         "price": 100
//       }
//     ],
//     "services": [
//       {
//         "_id": "60d0fe4f5311236168a109cf",
//         "name": "Photography",
//         "price": 200
//       }
//     ],
//     "packages": [
//       {
//         "_id": "60d0fe4f5311236168a109d0",
//         "name": "Wedding Package",
//         "price": 500
//       }
//     ],
//     "slots": [
//       {
//         "date": "2025-02-01T00:00:00.000Z",
//         "times": [
//           {
//             "startTime": "09:00",
//             "endTime": "11:00"
//           }
//         ]
//       },
//       {
//         "date": "2025-02-02T00:00:00.000Z",
//         "times": []
//       }
//     ],
//     "baseAmount": 800,
//     "gstAmount": 144,
//     "totalAmount": 944,
//     "advanceAmount": 200,
//     "onSiteAmount": 744,
//     "remainingAmount": 0,
//     "paymentStatus": "completed",
//     "partialPayments": [
//       {
//         "amount": 200,
//         "status": "completed",
//         "transactionDate": "2025-02-01T00:00:00.000Z",
//         "modeOfPayment": "online",
//         "onlinePaymentDetails": {
//           "cardDetails": {
//             "cardNumber": "**** **** **** 1234",
//             "cardHolderName": "John Doe",
//             "expiryDate": "12/25"
//           }
//         }
//       }
//     ],
//     "status": "completed",
//     "invoiceNumber": "INV-2025-0001"
//   },
//   // ... other orders
// ]
// }