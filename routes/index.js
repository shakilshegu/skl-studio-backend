// /api
import express from 'express';
import logger from '../logger.js'; // Import the logger

const router = express.Router();

// Import Routes
import studioRoutes from './studioRoutes.js';  
import authRoutes from './authRoutes.js';
import authPartnerRoutes from './partner/authPartner.Routes.js';     
import equipmentRoutes from './partner/equipment.Routes.js';
import serviceRoutes from './partner/service.Routes.js';
import packageRoutes from './partner/package.Routes.js';
import helperRoutes from './partner/helper.Routes.js';
import teamRoutes from './partner/teamMember.Routes.js';
import studioPRoutes from './partner/studio.Routes.js';
import studioSlots from './slotRoutes.js';
import adminRoutes from './superAdminRoutes.js';
import userRoutes from './userRoutes.js';
import adminDashboardRoutes from './adminDashboardRoutes.js';
import paymentRoutes from './payment.Routes.js';
import profileRoutes from './profileRoutes.js'
import studioCategoriesRoutes from './partner/studioCategories.Routes.js';
import partnerDashboardRoutes from './partner/partnerDashboard.Routes.js';
import equipmentCategoryRoutes from './partner/equipmentCategory.Routes.js'

// Users Routes
router.use('/auth', authRoutes);
router.use('/studio', studioRoutes);
router.use('/studio-slots', studioSlots);
router.use('/profile',profileRoutes)

router.use('/partner/auth',authPartnerRoutes);
router.use('/partner/equipment', equipmentRoutes);
router.use('/partner/service', serviceRoutes);
router.use('/partner/package', packageRoutes);
router.use('/partner/helper', helperRoutes);
router.use('/partner/team', teamRoutes);
router.use('/partner/equipmentCategories', equipmentCategoryRoutes);


router.use('/partner/studio', studioPRoutes);
router.use('/studio-categories', studioCategoriesRoutes);

router.use('/admin', adminRoutes);
router.use('/users', userRoutes);

router.use('/dashboard',adminDashboardRoutes)
router.use('/payment', paymentRoutes);


router.use('/partner-dashboard',partnerDashboardRoutes)

router.use('/partner-dashboard', partnerDashboardRoutes);


// Test error logging endpoint
router.get('/test-error', (req, res, next) => {
  const error = new Error('Test error');
  next(error);
});

// Error handling middleware
router.use((err, req, res, next) => {
  logger.error(err.message, { metadata: err });
  res.status(500).json({ message: 'An error occurred' });
});

export default router;