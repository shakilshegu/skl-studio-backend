import Cart from '../models/cartModel.js';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique identifier
import User from '../models/userModel.js'; // Ensure you import the User model
import Studio from '../models/partner/studio.Model.js'; // Ensure you import the Studio 

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZOPAY_API_KEY,
  key_secret: process.env.RAZOPAY_SECRECT_KEY
});

export const createOrder = async (req, res) => {
  try {
    
    let { amount, currency, cartId } = req.body;
    amount = 100; // For testing purposes
    cartId = "677e412925bbf3a565e4ad84" ;
    currency = "INR";
    // Generate a unique receipt ID
    const receipt = `${cartId}-${Date.now()}`;
   
 
    console.log(receipt);
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt // Unique identifier for the order
    };


    const order = await razorpay.orders.create(options);
    console.log(order)
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order", error });
  }
};

const verifyPaymentWithRazorpay = async (transactionId) => {
  const payment = await razorpay.payments.fetch(transactionId);
  if (payment.status !== 'captured') {
    throw new Error("Payment not verified");
  }
  return payment;
};

export const verifyAndUpdatePayment = async (req, res) => {
  try {
    const { studioId, cartId , razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!studioId || !cartId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "studioId, cartId, razorpay_order_id, razorpay_payment_id, and razorpay_signature are required" });
    }

    console.log(`Verifying payment for studioId: ${studioId}, cartId: ${cartId}, razorpay_order_id: ${razorpay_order_id}, razorpay_payment_id: ${razorpay_payment_id}, and razorpay_signature: ${razorpay_signature}`);

    // Find the cart
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Verify payment signature
    const generated_signature = crypto.createHmac('sha256', process.env.RAZOPAY_SECRECT_KEY)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Verify payment with Razorpay
    const payment = await verifyPaymentWithRazorpay(razorpay_payment_id);
    const paymentAmount = payment.amount / 100; // Convert from paise to rupees

    // Check if the payment amount matches the advance amount
    if (paymentAmount === cart.advanceAmount) {
      // Add to partial payments
        cart.partialPayments.push({
        amount: paymentAmount,
        status: 'completed',
        transactionDate: new Date(),
        modeOfPayment: 'online',
        onlinePaymentDetails: {
          cardDetails: {
            cardNumber: payment.card_id,
            cardHolderName: payment.card_holder_name,
            expiryDate: payment.card_expiry
          }
        }
      });

        // Update the cart status
      await cart.save();

      res.status(200).json({ message: "Payment verified and updated successfully", cart });
    } else if (paymentAmount < cart.advanceAmount) {
      // Reduce the advance amount as per the amount paid
      cart.advanceAmount -= paymentAmount;

      // Add to partial payments
      cart.partialPayments.push({
        amount: paymentAmount,
        status: 'completed',
        transactionDate: new Date(),
        modeOfPayment: 'online',
        onlinePaymentDetails: {
          cardDetails: {
            cardNumber: payment.card_id,
            cardHolderName: payment.card_holder_name,
            expiryDate: payment.card_expiry
          }
        }
      });

      await cart.save();

      res.status(200).json({ message: "Please pay the remaining advance amount", remainingAdvanceAmount: cart.advanceAmount });
    } else {
      // Handle case where payment amount is greater than advance amount
      const remainingAmount = paymentAmount - cart.advanceAmount;
      cart.advanceAmount = 0;
      cart.remainingAmount -= remainingAmount;

      // Add to partial payments
      cart.partialPayments.push({
        amount: paymentAmount,
        status: 'completed',
        transactionDate: new Date(),
        modeOfPayment: 'online',
        onlinePaymentDetails: {
          cardDetails: {
            cardNumber: payment.card_id,
            cardHolderName: payment.card_holder_name,
            expiryDate: payment.card_expiry
          }
        }
      });

      await cart.save();

      res.status(200).json({ message: "Advance amount paid successfully, remaining amount deducted", remainingAmount: cart.remainingAmount });
    }
  } catch (error) {
    console.error("An error occurred while verifying and updating payment:", error);
    res.status(500).json({ message: "An error occurred while verifying and updating payment", error });
  }
};

// handling Offline ( cash , cheque , qr code ) payment
export const handleOfflinePayment = async (req, res) => {
    try {
        const { cartId, amount, paymentMethod, receiptNumber } = req.body;
    
        if (!cartId || !amount || !paymentMethod || !receiptNumber) {
        return res.status(400).json({ message: "cartId, amount, paymentMethod, and receiptNumber are required" });
        }
    
        console.log(`Handling offline payment for cartId: ${cartId}, amount: ${amount}, paymentMethod: ${paymentMethod}, and receiptNumber: ${receiptNumber}`);
    
        // Find the cart
        const cart = await Cart.findById(cartId);
    
        if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
        }
    
        // Add to partial payments
        cart.partialPayments.push({
        amount,
        status: 'completed',
        transactionDate: new Date(),
        modeOfPayment: 'offline',
        offlinePaymentDetails: {
            paymentMethod,
            receiptNumber
        }
        });
    
        // here payment status is presaved based on amount paid . 
        await cart.save();
    
        res.status(200).json({ message: "Offline payment handled successfully", cart });
    } catch (error) {
        console.error("An error occurred while handling offline payment:", error);
        res.status(500).json({ message: "An error occurred while handling offline payment", error });
    }
}

export const handleOnlinePayment = async (req, res) => {
    try {
        const { cartId, amount, paymentMethod, transactionId } = req.body;
        if(!cartId || !amount || !paymentMethod || !transactionId) {
            return res.status(400).json({ message: "cartId, amount, paymentMethod, and transactionId are required" });
        }
        console.log(`Handling online payment for cartId: ${cartId}, amount: ${amount}, paymentMethod: ${paymentMethod}, and transactionId: ${transactionId}`);
        // Find the cart
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        // Verify payment with Razorpay
        const payment = await verifyPaymentWithRazorpay(transactionId);
        if (payment.status !== 'captured') {
            return res.status(400).json({ message: "Payment not verified" });
        }
        const paymentAmount = payment.amount / 100; // Convert from paise to rupees

        if(cart.advanceAmount>0){
            if(paymentAmount<cart.advanceAmount){
                cart.advanceAmount -= paymentAmount;
                cart.partialPayments.push({
                    amount: paymentAmount,
                    status: 'completed',
                    transactionDate: new Date(),
                    modeOfPayment: 'online',
                    onlinePaymentDetails: {
                        cardDetails: {
                            cardNumber: payment.card_id,
                            cardHolderName: payment.card_holder_name,
                            expiryDate: payment.card_expiry
                        }
                    }
                });
                await cart.save();
                return res.status(200).json({ message: "Please pay the remaining advance amount", remainingAdvanceAmount: cart.advanceAmount });
            } else {
                const remainingAmount = paymentAmount - cart.advanceAmount;
                cart.advanceAmount = 0;
                cart.remainingAmount -= remainingAmount;
                cart.partialPayments.push({
                    amount: paymentAmount,
                    status: 'completed',
                    transactionDate: new Date(),
                    modeOfPayment: 'online',
                    onlinePaymentDetails: {
                        cardDetails: {
                            cardNumber: payment.card_id,
                            cardHolderName: payment.card_holder_name,
                            expiryDate: payment.card_expiry
                        }
                    }
                });
                await cart.save();
                return res.status(200).json({ message: "Advance amount paid successfully, remaining amount deducted", remainingAmount: cart.remainingAmount });
            }
        }
      
        // Add to partial payments
        cart.partialPayments.push({
            amount: paymentAmount,
            status: 'completed',
            transactionDate: new Date(),
            modeOfPayment: 'online',
            onlinePaymentDetails: {
                cardDetails: {
                    cardNumber: payment.card_id,
                    cardHolderName: payment.card_holder_name,
                    expiryDate: payment.card_expiry
                }
            }
        });
        await cart.save();
        res.status(200).json({ message: "Payment verified and updated successfully", cart });   
    } catch (error) {
        console.error("An error occurred while handling online payment:", error);
        res.status(500).json({ message: "An error occurred while handling online payment", error });
        
    }
}



