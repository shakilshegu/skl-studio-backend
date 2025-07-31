import Slot from '../models/slotModel.js';
import Cart from '../models/cartModel.js';
import Equipment from '../models/partner/equipment.Model.js';
import Service from '../models/partner/service.Model.js';
import Package from '../models/partner/package.Model.js';
import Studio from '../models/partner/studio.Model.js';


// Controller to get available slots by date, time range, and city
export const getAvailableSlots = async (req, res) => {
  try {
    const { date, startTime, endTime, city } = req.query;

    if (!date || !startTime || !endTime || !city) {
      return res.status(400).json({ message: 'Date, startTime, endTime, and city are required' });
    }

    const availableSlots = await Slot.find({
      date: new Date(date),
      'slots.status': 'available',
      'slots.startTime': { $gte: startTime },
      'slots.endTime': { $lte: endTime }
    }).populate({
      path: 'studioId',
      model: 'partnerstudios',
      match: { 'address.city': city }
    });

    // Filter out slots where the studio does not match the city
    const filteredSlots = availableSlots.filter(slot => slot.studioId);

    res.status(200).json(filteredSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { cartId, amount } = req.body;

    if (!cartId || !amount) {
      return res.status(400).json({ message: "cartId and amount are required" });
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Add the new payment to the partialPayments array
    cart.partialPayments.push({ amount, status: "completed" });

    // Calculate the total paid amount
    const totalPaid = cart?.partialPayments
      .filter((payment) => payment.status === "completed")
      .reduce((sum, payment) => sum + payment.amount, 0);

    // Calculate the remaining amount
    const remainingAmount = cart.totalAmount - totalPaid;


    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Payment status updated successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the payment status", error });
  }
};

export const updateCartAmounts = async (cart, studioId) => {
  const amounts = await calculateCartAmounts(cart, studioId);

  const ensureNumber = (value) => isNaN(value) ? 0 : value;


  cart.baseAmount = ensureNumber(amounts.baseAmount);
  cart.gstAmount = ensureNumber(amounts.gstAmount);
  cart.totalAmount = ensureNumber(amounts.totalAmount);
  cart.advanceAmount = ensureNumber(amounts.advanceAmount);
  cart.onSiteAmount = ensureNumber(amounts.onSiteAmount);
  cart.remainingAmount = ensureNumber(amounts.remainingAmount);


  // Save the updated cart
  await cart.save();

  // Return detailed amounts
  return {
    equipmentAmount: amounts.equipmentAmount,
    serviceAmount: amounts.serviceAmount,
    packageAmount: amounts.packageAmount,
    slotAmount: amounts.slotAmount,
    baseAmount: amounts.baseAmount,
    gstAmount: amounts.gstAmount,
    totalAmount: amounts.totalAmount,
    advanceAmount: amounts.advanceAmount,
    onSiteAmount: amounts.onSiteAmount,
    remainingAmount: amounts.remainingAmount
  };
};

export const addToCart = async (req, res) => {
  try {
    const { studioId, equipments, services, packages, slotIds, hourlySlotIds, rateType } = req.body;
    const userId = req.user._id
    console.log("user",userId);
    
    let equipmentItems = [];
    let serviceItems = [];
    let packageItems = [];
    let slotItems = [];
    let totalAmount = 0;
    let hourlySlots = [];
    let dailySlotItems = [];
    let equipmentAmount = 0;
    let packageAmount = 0;
    let serviceAmount = 0;
    let slotAmount = 0;
    // Handle equipments
    if (equipments) {
      const equipmentIds = equipments.map(e => e.id);
      const equipmentQuantities = equipments.reduce((acc, e) => {
        acc[e.id] = e.quantity;
        return acc;
      }, {});

      equipmentItems = await Equipment.find({ _id: { $in: equipmentIds } });

      equipmentItems = equipmentItems.map(item => ({
        id: item._id,
        amount: item.price,
        quantity: equipmentQuantities[item._id.toString()]
      }));

      equipmentAmount = equipmentItems.reduce((sum, item) => sum + item.amount * item.quantity, 0);

    }

    // Handle services
    if (services) {
      const serviceIds = services.map(s => s.id);
      serviceItems = await Service.find({ _id: { $in: serviceIds } });

      serviceItems = serviceItems.map(item => ({
        id: item._id,
        amount: item.price
      }));

      serviceAmount = serviceItems.reduce((sum, item) => sum + item.amount, 0);

    }

    // Handle packages
    if (packages) {
      const packageIds = packages.map(p => p.id);
      debugger;
      packageItems = await Package.find({ _id: { $in: packageIds } });

      packageItems = packageItems.map(item => ({
        id: item._id,
        amount: item.price
      }));

      packageAmount = packageItems.reduce((sum, item) => sum + item.amount, 0);

    } else {
      packageItems = [];
    }

    // Check slot availability
    const availabilityCheck = await checkSlotAvailability({ body: { slotIds: rateType === "hourly" ? hourlySlotIds : slotIds, studioId, rateType } }, res);
    if (availabilityCheck.status !== 200) {
      return res.status(availabilityCheck.status).json({ message: availabilityCheck.message, unavailableSlots: availabilityCheck.unavailableSlots });
    }

    // Handle slots
    if (rateType === "hourly" && hourlySlotIds) {
      slotItems = await Slot.find({ "slots._id": { $in: hourlySlotIds }, studioId });

      // Filter slots and calculate amount
      slotItems = slotItems.map(item => ({
        ...item.toObject(),
        slots: item.slots.filter(slot => hourlySlotIds.includes(slot._id.toString()))
      }));

      slotAmount += slotItems.reduce((sum, item) => {
        const filteredSlots = item.slots.filter(slot =>
          hourlySlotIds.includes(slot._id.toString())
        );
        return sum + filteredSlots.length * item.hourlyPrice;
      }, 0);

      // Store just the hourlySlotIds instead of entire slot documents
      hourlySlots = hourlySlotIds;  // This is the fix
    } else if (rateType === "daily" && slotIds) {
      debugger;
      let slots = await Slot.find({ _id: { $in: slotIds } });
      slotAmount += slots.reduce((sum, item) => sum + item.dailyPrice, 0);

      dailySlotItems = slotIds;
    }

    // Check for existing cart items and delete if found
    let existingCartItems = await Cart.find({ user: userId, paymentStatus: 'pending', status: 'pending' });
    if (existingCartItems.length > 0) {
      await Cart.deleteMany({ user: userId, paymentStatus: 'pending', status: 'pending' });
    }

    // Delete existing pending carts not created today
    const currentDate = new Date().setHours(0, 0, 0, 0);
    let existingCarts = await Cart.find({
      user: userId,
      paymentStatus: 'pending',
      status: 'pending'
    });

    for (const cart of existingCarts) {
      if (new Date(cart.createdDate).setHours(0, 0, 0, 0) !== currentDate) {
        await cart.remove();
      }
    }

    // Create new cart item
    let newCartItem = new Cart({
      user: userId,
      studio: studioId,
      equipments: equipmentItems,
      services: serviceItems,
      packages: packageItems,
      dailySlots: dailySlotItems,
      hourlySlots: hourlySlots,
      totalAmount,
      bookingType: rateType,
      paymentStatus: 'pending',
      status: 'pending',
      rateType,

    });

    // Calculate and update cart amounts
    const calculatedAmounts = await calculateCartAmounts(newCartItem, slotAmount, equipmentAmount, serviceAmount, packageAmount, studioId);
    newCartItem = Object.assign(newCartItem, calculatedAmounts);

    await newCartItem.save();

    return res.status(201).json({ message: 'Added to cart successfully', cart: newCartItem });
  } catch (error) {
    console.error("An error occurred while adding to cart:", error);
    return res.status(500).json({ message: "An error occurred while adding to cart", error });
  }
};

// Function to check slot availability
export const checkSlotAvailability = async (req, res) => {
  try {
    const { slotIds, studioId, rateType } = req.body;

    let slots;
    if (rateType === "hourly") {
      slots = await Slot.find({ "slots._id": { $in: slotIds }, studioId });
      if (!slots || slots.length === 0) {
        return { status: 404, message: "Slots not found" };
      }
      const unavailableSlots = slots.flatMap(slot =>
        slot.slots.filter(s => slotIds.includes(s._id.toString()) && s.status !== "available")
      );
      if (unavailableSlots.length > 0) {
        return { status: 400, message: "Some slots are not available", unavailableSlots };
      }
    } else if (rateType === "daily") {
      slots = await Slot.find({ _id: { $in: slotIds }, studioId });
      if (!slots || slots.length === 0) {
        return { status: 404, message: "Slots not found" };
      }
      const isAvailable = slots.filter(slot => slot.slotBookingPercentage !== 0);
      if (isAvailable.length > 0) {
        return { status: 400, message: "Some slots are not available due to booking percentage", unavailableSlots: isAvailable };
      }
    }

    return { status: 200, message: "Slots are available" };
  } catch (error) {
    console.error("An error occurred while checking slot availability:", error);
    return { status: 500, message: "An error occurred while checking slot availability", error };
  }
};

// Function to calculate cart amounts
export const calculateCartAmounts = async (cart, slotAmount, equipmentAmount, serviceAmount, packageAmount, studioId) => {
  debugger;
  // Recalculate baseAmount
  const baseAmount = slotAmount + equipmentAmount + serviceAmount + packageAmount;

  // GST and platform fee
  const gstPercentage = cart.gstPercentage || 18;
  const gstAmount = baseAmount * (gstPercentage / 100);
  const platformFee = 500;
  const totalAmount = baseAmount + gstAmount + platformFee;

  const advanceAmount = Math.round(totalAmount * 0.2);
  const onSiteAmount = totalAmount - advanceAmount;

  // Remaining amount calculation
  const totalPaid = cart?.partialPayments
    .filter((payment) => payment.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = totalAmount - totalPaid;

  return {
    equipmentAmount,
    serviceAmount,
    packageAmount,
    slotAmount,
    baseAmount,
    gstAmount,
    totalAmount,
    advanceAmount,
    onSiteAmount,
    remainingAmount
  };
};

export const modifySlotTiming = async (req, res) => {
  try {
    const { cartId, newSlotTiming, slotIds, rateType } = req.body;
    const { startTime, endTime } = newSlotTiming;

    // Find the cart by ID
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Check slot availability for the new timing
    const { slotItems: checkedSlotItems, totalAmount: checkedTotalAmount, slots: checkedSlots } = await checkSlotAvailability(newSlotTiming, slotIds, cart.studio, rateType);

    // Update the cart with the new slot timings and slots
    cart.slotTiming = newSlotTiming;
    cart.slots = checkedSlots;

    // Update the total amount
    cart.totalAmount = checkedTotalAmount;

    // Save the cart
    await cart.save();

    res.status(200).json({ message: "Slot timing modified successfully", cart });
  } catch (error) {
    console.error("An error occurred while modifying slot timing:", error);
    res.status(500).json({ message: "An error occurred while modifying slot timing", error });
  }
};

export const getCurrentCartDetails = async (req, res) => {
  try {
    debugger;
    const { userId, studioId } = req.params;

    if (!userId || !studioId) {
      return res.status(400).json({ message: "userId and studioId are required" });
    }

    const currentDate = new Date();
    const cart = await Cart.findOne({
      user: userId,
      studio: studioId,
      paymentStatus: 'pending'
    })
      .sort({ createdAt: -1 })
      .populate('slots')
      .exec();

    if (!cart) {
      return res.status(404).json({ message: "No pending cart found for the given user and studio" });
    }

    const validSlots = cart.slots.every(slot => new Date(slot.date) >= currentDate);

    if (!validSlots) {
      return res.status(404).json({ message: "No valid slots found for the given user and studio" });
    }



    res.status(200).json({ cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching the cart details", error });
  }
};

export const modifyCartItem = async (req, res) => {
  try {
    const { cartId, itemId, itemType, action, quantity } = req.body;

    if (!cartId || !itemId || !itemType || !action) {
      return res.status(400).json({ message: "cartId, itemId, itemType, and action are required" });
    }

    const validTypes = ["equipments", "services", "packages"];
    if (!validTypes.includes(itemType)) {
      return res.status(400).json({ message: "Invalid itemType provided" });
    }

    const validActions = ["add", "delete"];
    if (!validActions.includes(action)) {
      return res.status(400).json({ message: "Invalid action provided" });
    }

    // Find the cart
    let cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    let item;
    if (itemType === "equipments") {
      item = await Equipment.findById(itemId).select("price currentStock");
    } else if (itemType === "services") {
      item = await Service.findById(itemId).select("price");
    } else if (itemType === "packages") {
      item = await Package.findById(itemId).select("price");
    }

    if (!item) {
      return res.status(404).json({ message: `${itemType.slice(0, -1)} not found` });
    }

    if (action === "add") {
      // Check if there is enough stock for the equipment
      if (itemType === "equipments" && item.currentStock < quantity) {
        return res.status(400).json({ message: "Not enough stock available" });
      }

      // Add item to the cart with quantity for equipments
      if (itemType === "equipments") {
        cart[itemType].push({ id: item._id, amount: item.price, quantity });
        item.currentStock -= quantity;
        await item.save();
        cart.equipmentAmount = (cart.equipmentAmount || 0) + item.price * quantity;
      } else if (itemType === "services") {
        cart[itemType].push({ id: item._id, amount: item.price });
        cart.serviceAmount = (cart.serviceAmount || 0) + item.price;
      } else if (itemType === "packages") {
        cart[itemType].push({ id: item._id, amount: item.price });
        cart.packageAmount = (cart.packageAmount || 0) + item.price;
      }
    } else if (action === "delete") {
      // Remove the item from the cart
      const itemIndex = cart[itemType].findIndex((cartItem) => cartItem.id.toString() === itemId);
      if (itemIndex === -1) {
        return res.status(404).json({ message: `${itemType.slice(0, -1)} not found in cart` });
      }

      const itemInCart = cart[itemType][itemIndex];

      // Update the stock for the equipment
      if (itemType === "equipments") {
        const equipment = await Equipment.findById(itemId);
        equipment.currentStock += itemInCart.quantity;
        await equipment.save();
        cart.equipmentAmount -= itemInCart.amount * itemInCart.quantity;
      } else if (itemType === "services") {
        cart.serviceAmount -= itemInCart.amount;
      } else if (itemType === "packages") {
        cart.packageAmount -= itemInCart.amount;
      }

      cart[itemType].splice(itemIndex, 1);
    }

    // Recalculate total amount
    const baseAmount = (cart.equipmentAmount || 0) + (cart.serviceAmount || 0) + (cart.packageAmount || 0) + (cart.slotAmount || 0);
    const gstPercentage = cart.gstPercentage || 18;
    const gstAmount = baseAmount * (gstPercentage / 100);
    const platformFee = 500;
    const totalAmount = baseAmount + gstAmount + platformFee;
    cart.totalAmount = totalAmount;

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: `${itemType.slice(0, -1)} ${action}ed successfully`, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `An error occurred while ${action}ing the ${itemType.slice(0, -1)} to/from the cart`, error });
  }
};

export const proceedToPayment = async (req, res) => {
  try {
    const { cartId } = req.body;

    if (!cartId) {
      return res.status(400).json({ message: "cartId is required" });
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Check all items in the cart
    const equipmentIds = cart.equipments.map(item => item.id);
    const serviceIds = cart.services.map(item => item.id);
    const packageIds = cart.packages.map(item => item.id);

    const equipments = await Equipment.find({ _id: { $in: equipmentIds } });
    const services = await Service.find({ _id: { $in: serviceIds } });
    const packages = await Package.find({ _id: { $in: packageIds } });

    // Check availability and prepare response
    const availableEquipments = equipments.map(equipment => {
      const cartItem = cart.equipments.find(item => item.id.toString() === equipment._id.toString());
      return {
        ...cartItem,
        available: equipment.currentStock >= cartItem.quantity
      };
    });

    const availableServices = services.map(service => ({
      ...service.toObject(),
      available: true
    }));

    const availablePackages = packages.map(pkg => ({
      ...pkg.toObject(),
      available: true
    }));

    // Calculate amounts for each category
    const equipmentAmount = availableEquipments.reduce((sum, item) => item.available ? sum + item.amount * item.quantity : sum, 0);
    const serviceAmount = availableServices.reduce((sum, item) => sum + item.price, 0);
    const packageAmount = availablePackages.reduce((sum, item) => sum + item.price, 0);
    const slotAmount = cart.slots.reduce((sum, item) => sum + item.amount, 0);

    // Recalculate baseAmount
    const baseAmount = equipmentAmount + serviceAmount + packageAmount + slotAmount;

    // GST and platform fee
    const gstPercentage = cart.gstPercentage || 18;
    const gstAmount = baseAmount * (gstPercentage / 100);
    const platformFee = 500;
    const totalAmount = baseAmount + gstAmount + platformFee;

    const advanceAmount = Math.round(totalAmount * 0.2);
    const onSiteAmount = totalAmount - advanceAmount;

    // Remaining amount calculation
    const totalPaid = cart.partialPayments
      .filter((payment) => payment.status === "completed")
      .reduce((sum, payment) => sum + payment.amount, 0);
    const remainingAmount = totalAmount - totalPaid;

    // Return detailed amounts
    res.status(200).json({
      message: "Proceed to payment",
      cart: {
        equipments: availableEquipments,
        services: availableServices,
        packages: availablePackages,
        slots: cart.slots,
        amounts: {
          equipmentAmount,
          serviceAmount,
          packageAmount,
          slotAmount,
          baseAmount,
          gstAmount,
          totalAmount,
          advanceAmount,
          onSiteAmount,
          remainingAmount,
          paymentStatus: remainingAmount <= 0 ? "paid" : totalPaid > 0 ? "partially_paid" : "pending",
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while proceeding to payment", error });
  }
};

export const createSlot = async (req, res) => {
  try {
    const { studioId, date, slots } = req.body;

    // Validate input
    if (!studioId || !date || !slots || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ message: "Missing required fields or slots information" });
    }


    const studio = await Studio.findById(studioId);
    if (!studio) {
      return res.status(404).json({ message: "Studio not found" });
    }

    // Create slot document
    const newSlot = new Slot({
      studioId: studio._id,
      date: new Date(date),
      rateType: 'hourly', // or 'daily' based on your requirement
      hourlyPrice: studio.price.perHour,
      dailyPrice: studio.price.perDay,
      slots: slots.map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'available'
      }))
    });

    // Save the slot document
    await newSlot.save();

    res.status(201).json({ message: "Slot created successfully", slot: newSlot });
  } catch (error) {
    console.error("Error creating slot:", error);
    res.status(500).json({ message: "An error occurred while creating the slot", error });
  }
};

export const getCartDetails = async (req, res) => {
  try {
    const { studioId } = req.query;
    const userId = req.user._id
    if (!userId || !studioId) {
      return res.status(400).json({ message: "userId and studioId are required" });
    }

    const studioInfo = await Studio.findById(studioId);
    if (!studioInfo) {
      return res.status(404).json({ message: "Studio not found" });
    }

    const cart = await Cart.findOne({ user: userId, studio: studioId })
      .populate('equipments.id').populate('services.id').populate('packages.id')
    debugger;
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ message: "Cart details fetched successfully", cart, studioInfo });
  } catch (error) {
    console.error("An error occurred while fetching cart details:", error);
    res.status(500).json({ message: "An error occurred while fetching cart details", error });
  }
};

export const bookSlot = async (req, res) => {
  try {
    const { userId, studioId, date, startTime, endTime, equipments, services, packages } = req.body;

    // Ensure that all required data is provided
    if (!userId || !studioId || !date || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Parse the date to ensure it is a valid date object
    const parsedDate = new Date(date);

    // Find the Slot document for the studio and date
    const slot = await Slot.findOne({
      studioId: studioId,
      date: parsedDate,
    });

    // Check if the slot exists for the given studio and date
    if (!slot) {
      return res.status(404).json({ message: "No available slots for this studio and date." });
    }

    // Check if any of the time slots are already booked (check all slots for the given time range)
    const isSlotBooked = slot.slots.some(s =>
      ((s.startTime >= startTime && s.startTime < endTime) || (s.endTime > startTime && s.endTime <= endTime)) && s.status === 'booked'
    );

    if (isSlotBooked) {
      return res.status(400).json({ message: "One or more slots in the specified time range are already booked." });
    }

    // Check if there is any partially paid cart for the user and studio on the same date and time range
    const existingCart = await Cart.findOne({
      user: userId,
      studio: studioId,
      slotTiming: { startTime, endTime },
      paymentStatus: "partially_paid"
    });

    if (existingCart) {
      return res.status(400).json({ message: "Cannot book slot as payment is partially paid." });
    }

    // Proceed to create a new cart entry
    const cart = new Cart({
      user: userId,
      studio: studioId,
      slot: slot._id,  // Referring to the Slot document by its ID
      slotTiming: { startTime, endTime },
      equipments,
      services,
      packages,
      baseAmount: 0, // Will be calculated later
      gstAmount: 0, // Will be calculated later
      totalAmount: 0, // Will be calculated later
      advanceAmount: 0, // Will be calculated later
      onSiteAmount: 0, // Will be calculated later
      remainingAmount: 0, // Will be calculated later
      paymentStatus: "pending",
      partialPayments: [],
      status: "pending"
    });

    // Save the cart and update the slot's status to "booked"
    await cart.save();

    // Update the slot's status to "booked"
    const updatedSlot = await Slot.findOneAndUpdate(
      { studioId: studioId, date: parsedDate, "slots.startTime": startTime, "slots.endTime": endTime },
      {
        $set: {
          "slots.$.status": "booked",
          "slots.$.bookedBy": userId
        }
      },
      { new: true }
    );

    res.status(200).json({ message: "Slot booked successfully", cart });
  } catch (err) {
    res.status(500).json({ message: "Error booking slot", error: err });
  }
};

export const getAllSlotsByStudio = async (req, res) => {
  try {
    const slots = await Slot.find({ date: new Date() });

    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getHourlySlots = async (studioId, date) => {
  // Create a date range for the start and end of the specified date (midnight to 11:59:59.999)
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  // Query the database to find the slots by studioId and the date range
  const slots = await Slot.find({
    studioId: studioId,
    date: { $gte: startOfDay, $lte: endOfDay }, // Match any slots on the specified date
  });

  return slots;
};

const getDailySlots = async (studioId, month) => {
  const [year, monthIndex] = month.split('-').map(Number);
  const startOfMonth = new Date(year, monthIndex - 1, 1);
  const endOfMonth = new Date(year, monthIndex, 0);

  // Query the database to find the slots by studioId and the month range
  const slots = await Slot.find({
    studioId: studioId,
    date: { $gte: startOfMonth, $lte: endOfMonth }, // Match any slots in the specified month
  });

  // Create a calendar object with slot availability based on slotBookingPercentage
  const calendar = [];
  slots.forEach(slot => {
    const slotDate = new Date(slot.date);
    if (slot._id) {
      calendar.push({
        date: slotDate.toLocaleDateString(),
        available: slot.slotBookingPercentage < 100,
        slotBookingPercentage: slot.slotBookingPercentage,
        slotId: slot._id,
      });
    }
  });

  return calendar;
};
export const getSlotsByStudioAndDate = async (req, res) => {
  try {
    const { studioId, date, month, bookingType } = req.query;

    // Ensure that studioId, bookingType, and either date or month are provided
    if (!studioId || !bookingType || (!date && !month)) {
      return res.status(400).json({ message: "studioId, bookingType, and either date or month are required" });
    }

    let result;
    if (bookingType === 'hourly') {
      if (!date) {
        return res.status(400).json({ message: "Date is required for hourly bookingType." });
      }
      // Parse the date and ensure it's a valid Date object
      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      result = await getHourlySlots(studioId, parsedDate);
    } else if (bookingType === 'daily') {
      if (!month) {
        return res.status(400).json({ message: "Month is required for daily bookingType." });
      }
      result = await getDailySlots(studioId, month);
    } else {
      return res.status(400).json({ message: "Invalid bookingType. Must be 'hourly' or 'daily'." });
    }

    // Check if no slots are available
    if (!result || result.length === 0) {
      return res.status(200).json({ message: "No slots available for the selected date and studio." });
    }

    // Return the found slots or calendar
    res.status(200).json(result);
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ message: 'Error fetching slots', error: err });
  }
};



