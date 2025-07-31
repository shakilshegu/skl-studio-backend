import Slot from '../models/slotModel.js';
import Cart from '../models/cartModel.js';



export const createBooking = async (req, res) => {
  try {
    const studio = await Studio.findById(req.body.studio);
    if (!studio || studio.isDeleted) {
      return res.status(404).json({ message: 'Studio not found' });
    }

    const startTime = new Date(req.body.startTime);
    const endTime = new Date(req.body.endTime);
    const totalHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    const booking = new Booking({
      user: req.user._id,
      studio: req.body.studio,
      startTime: startTime,
      endTime: endTime,
      totalHours: totalHours,
      totalPrice: totalHours * studio.price,
      status: 'Pending'
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('studio', 'name')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('studio', 'name')
      .populate('user', 'name email');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserBookingsByDateRange = async (req, res) => {
  try {
    const { userId, fromDate, toDate } = req.query;

    const bookings = await Cart.find({
      user: userId,
      paymentStatus: { $ne: 'pending' },
      startTime: { $gte: new Date(fromDate), $lte: new Date(toDate) }
    })
      .populate('studio', 'name')
      .populate('equipments.id', 'name')
      .populate('services.id', 'name')
      .populate('packages.id', 'name')
      .sort({ startTime: -1 });

    const detailedBookings = await Promise.all(bookings.map(async (booking) => {
      const cart = await Cart.findOne({ booking: booking._id })
        .populate('studio', 'name')
        .populate('equipments.id', 'name')
        .populate('services.id', 'name')
        .populate('packages.id', 'name');

      if (cart.bookingType === 'daily') {
        cart.dailySlots = await Slot.find({ _id: { $in: cart.dailySlots } });
      } else if (cart.bookingType === 'hourly') {
        const slotDetails = await Slot.find({ _id: { $in: cart.hourlySlots } });
        cart.hourlySlots = slotDetails.map(slot => slot.slots).flat();
      }
      return { ...booking.toObject(), cart };
    }));

    res.json(detailedBookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
