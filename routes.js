import express from "express";
import adminRouter from './routes/admin.routes.js'
import partnerRouter from './routes/partner.routes.js'
import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'

const router = express.Router();

router.use('/auth',authRouter)
router.use('/admin',adminRouter)
router.use('/partner',partnerRouter)
router.use('/user',userRouter)

export  default router