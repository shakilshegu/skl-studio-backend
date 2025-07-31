//  api/parner/studio/dashboard
import Studio from "../../models/partner/studio.Model.js";
import Cart from '../../models/cartModel.js';
import Equipment from "../../models/partner/equipment.Model.js";

const getStudioDetailsByUserId = async (req, res) => {
  
  try {
    debugger;
    const { Id } = req.body;

   
    console.log("Id",Id);
    const studio = await Studio.findOne({ 'owner.userId': Id });
    debugger;
    if (!studio) {
      return res.status(404).json({ message: "Studio not found" });
    }

    const orders = await Cart.find({ studio: studio._id, paymentStatus: 'pending' });
    const equipment = studio.equipments;
    const services = studio.services;
    const packages = studio.packages;

    // Calculate average rating
    const averageRating = studio.reviews.length > 0
      ? studio.reviews.reduce((acc, review) => acc + review.rating, 0) / studio.reviews.length
      : 0;

    res.status(200).json({
      studio,
      orders,
      equipment,
      services,
      packages,
      averageRating
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching studio details", error });
  }
};

const getRevenueAndOrderCountByUserId = async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.body.id;
    console.log(userId, "userId",req.body);
    if (!userId || !year) {
      return res.status(400).json({ message: "userId and year are required" });
    }

    const studio = await Studio.findOne({ 'owner.userId': userId });

    if (!studio) {
      return res.status(404).json({ message: "Studio not found" });
    }

    let revenueList = [];
    let orderCountList = [];

    if (!month) {
      // If only year is provided, return month-wise revenue and order count
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      const carts = await Cart.find({ studio: studio._id, createdAt: { $gte: startDate, $lte: endDate } });

      const monthlyRevenue = {};
      const monthlyOrderCount = {};

      carts.forEach(cart => {
        const cartMonth = cart.createdAt.getMonth() + 1; // getMonth() is zero-based
        if (!monthlyRevenue[cartMonth]) {
          monthlyRevenue[cartMonth] = 0;
        }
        if (!monthlyOrderCount[cartMonth]) {
          monthlyOrderCount[cartMonth] = 0;
        }
        const totalPaid = cart.partialPayments.reduce((partialSum, payment) => partialSum + payment.amount, 0);
        monthlyRevenue[cartMonth] += totalPaid;
        monthlyOrderCount[cartMonth] += 1;
      });

      revenueList = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        revenue: monthlyRevenue[i + 1] || 0
      }));

      orderCountList = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        count: monthlyOrderCount[i + 1] || 0
      }));

      res.status(200).json({ revenueList, orderCountList });
    } else {
      // If both month and year are provided, return date-wise revenue and order count
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // Last day of the month
      const carts = await Cart.find({ studio: studio._id, createdAt: { $gte: startDate, $lte: endDate } });

      const dailyRevenue = {};
      const dailyOrderCount = {};

      carts.forEach(cart => {
        const cartDate = cart.createdAt.getDate();
        if (!dailyRevenue[cartDate]) {
          dailyRevenue[cartDate] = 0;
        }
        if (!dailyOrderCount[cartDate]) {
          dailyOrderCount[cartDate] = 0;
        }
        const totalPaid = cart.partialPayments.reduce((partialSum, payment) => partialSum + payment.amount, 0);
        dailyRevenue[cartDate] += totalPaid;
        dailyOrderCount[cartDate] += 1;
      });

      const daysInMonth = new Date(year, month, 0).getDate();
      revenueList = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        revenue: dailyRevenue[i + 1] || 0
      }));

      orderCountList = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        count: dailyOrderCount[i + 1] || 0
      }));

      res.status(200).json({ revenueList, orderCountList });
    }
  } catch (error) {
    console.error("An error occurred while fetching revenue and order count:", error);
    res.status(500).json({ message: "An error occurred while fetching revenue and order count", error });
  }
};

const getStudioStatsByUserId = async (req, res) => {
  try {
    const userId = req.body.id;
    console.log(req.body,req.body.id);

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const studio = await Studio.findOne({ 'owner.userId': userId });

    if (!studio) {
      return res.status(404).json({ message: "Studio not found" });
    }

    const totalEquipments = await Equipment.find({ studio: studio._id }).countDocuments();

    const carts = await Cart.find({ studio: studio._id, paymentStatus: { $ne: 'pending' } });

    const totalBookings = carts.length;
    const totalEarnings = carts.reduce((sum, cart) => {
      return sum + cart.partialPayments.reduce((partialSum, payment) => partialSum + payment.amount, 0);
    }, 0);

    res.status(200).json({
      totalBookings,
      totalEquipments,
      totalEarnings
    });
  } catch (error) {
    console.error("An error occurred while fetching studio stats:", error);
    res.status(500).json({ message: "An error occurred while fetching studio stats", error });
  }
};

const getBookingDetailsByStudioAndMonth = async (req, res) => {
  try {
    const { userId, studioId, month, year } = req.query;

    if (!studioId || !month || !year) {
      return res.status(400).json({ message: 'studioId, month, and year are required' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const currentDate = new Date();

    const carts = await Cart.find({
      studio: studioId,
      paymentStatus: { $ne: 'pending' },
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate('user studio slot');

    const categorizedCarts = {};

    // Initialize all dates in the month with count 0
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      categorizedCarts[dateStr] = {
        upcoming: [],
        ongoing: [],
        completed: [],
        cancelled: [],
        count: 0
      };
    }

    carts.forEach(cart => {
      const slotDate = new Date(cart.slot.date).toISOString().split('T')[0];
      const slotStartTime = new Date(`${cart.slot.date}T${cart.slotTiming.startTime}`);
      const slotEndTime = new Date(`${cart.slot.date}T${cart.slotTiming.endTime}`);

      if (cart.paymentStatus === 'cancelled') {
        categorizedCarts[slotDate].cancelled.push(cart);
      } else if (slotDate < currentDate.toISOString().split('T')[0]) {
        if (cart.paymentStatus === 'completed' || cart.paymentStatus === 'partially paid') {
          categorizedCarts[slotDate].completed.push(cart);
        }
      } else if (slotDate === currentDate.toISOString().split('T')[0]) {
        if (slotEndTime < currentDate) {
          categorizedCarts[slotDate].completed.push(cart);
        } else if (slotStartTime > currentDate) {
          categorizedCarts[slotDate].upcoming.push(cart);
        } else if (slotStartTime <= currentDate && slotEndTime >= currentDate) {
          categorizedCarts[slotDate].ongoing.push(cart);
        }
      } else if (slotDate > currentDate.toISOString().split('T')[0]) {
        categorizedCarts[slotDate].upcoming.push(cart);
      }

      categorizedCarts[slotDate].count += 1;
    });

    res.status(200).json(categorizedCarts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getStudioDetailsByUserId,
  getRevenueAndOrderCountByUserId,
  getStudioStatsByUserId,
  getBookingDetailsByStudioAndMonth
};
