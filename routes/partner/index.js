import express from 'express';
import partnerDashboardRoutes from './partnerDashboard.Routes.js';

const router = express.Router();

router.use('/', partnerDashboardRoutes);

export default router;
