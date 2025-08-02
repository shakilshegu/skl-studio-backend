import express from "express";
const router = express.Router();
import studioRouter from './partner-routes/studio.routes.js'
import equipmentRouter from './partner-routes/equipment.routes.js'
import packageRouter from './partner-routes/package.routes.js'
import serviceRouter from './partner-routes/service.routes.js'
import helperRouter from './partner-routes/helper.routes.js'
import teamRouter from './partner-routes/team.routes.js'
import businessRouter from './partner-routes/business.routes.js'
import portfolioRouter from './partner-routes/portfolio.routes.js' 
import freelancerRouter from './partner-routes/freelancer.routes.js'
import slotRouter from './partner-routes/slot.routes.js'
import availabilityRouter from './partner-routes/availability.routes.js'
import bookingsRouter from './partner-routes/bookings.routes.js'
import calenderRouter  from './partner-routes/calender.routes.js'

router.use('/business', businessRouter) 
 router.use('/studio', studioRouter) 
 router.use('/equipment', equipmentRouter) 
 router.use('/package', packageRouter) 
 router.use('/service', serviceRouter) 
 router.use('/helper', helperRouter) 
 router.use('/team-member', teamRouter) 
 router.use('/portfolio',portfolioRouter ) 
 router.use('/freelancer',freelancerRouter ) 
 router.use('/availability',availabilityRouter ) 
 router.use('/slot',slotRouter ) 
 router.use('/bookings',bookingsRouter ) 
 router.use('/calender',calenderRouter ) 



export  default router