import express from 'express'
import { getCartItemDetails } from '../../controllers/user/cart.controller.js';
const router = express.Router();

// Basic validation middleware
const validateItemDetailsRequest = (req, res, next) => {
  const { serviceIds = [], equipmentIds = [], packageIds = [], helperIds = [] } = req.body;
  
  // Check if all are arrays
  if (!Array.isArray(serviceIds) || !Array.isArray(equipmentIds) || 
      !Array.isArray(packageIds) || !Array.isArray(helperIds)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input',
      message: 'All ID fields must be arrays'
    });
  }
  
  next();
};

// Main route to get multiple item details
router.post('/item-details', validateItemDetailsRequest, getCartItemDetails);

// Route to get individual item details
// router.get('/item/:type/:id', getIndividualItemDetails);

export default router