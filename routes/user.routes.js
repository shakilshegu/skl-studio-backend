import express from "express";
const router = express.Router();
import studioRouter from './user-routes/studio.routes.js'
import profileRouter from "./user-routes/profile.routes.js"
import availabilityRouter from './user-routes/availability.routes.js'
import bookingsRouter from './user-routes/booking.routes.js'
import cartRouter from './user-routes/cart.routes.js'
import freelancerRouter from './user-routes/freelancer.routes.js'
import homeRouter from "./user-routes/home.routes.js"
import paymentRouter from "./user-routes/payment.routes.js"

router.use('/studio', studioRouter) 
router.use('/freelancers', freelancerRouter) 
router.use('/profile', profileRouter)
router.use('/availability', availabilityRouter) 
router.use('/bookings',bookingsRouter)
router.use('/cart',cartRouter)
router.use( '/home' ,homeRouter)
router.use( '/payment' ,paymentRouter)


export  default router