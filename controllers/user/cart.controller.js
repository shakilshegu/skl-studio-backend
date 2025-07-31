import mongoose from "mongoose";
import Equipment from "../../models/partner/equipment.model.js";
import Helper from "../../models/partner/helper.model.js";
import Package from "../../models/partner/package.model.js";
import Service from "../../models/partner/service.model.js";

/**
 * Fetch all item details in a single request
 */
const getCartItemDetails = async (req, res) => {
  try {
    const { 
      serviceIds = [], 
      equipmentIds = [], 
      packageIds = [], 
      helperIds = [] 
    } = req.body;

    await console.log(req.body,"================>>>>>>>>>>>>>>");
    
    // Validate ObjectIds
    const allIds = [...serviceIds, ...equipmentIds, ...packageIds, ...helperIds];
    const invalidIds = allIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
    
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid IDs',
        message: 'Some IDs are not valid'
      });
    }

    // Execute queries in parallel
    const [services, equipments, packages, helpers] = await Promise.all([
      serviceIds.length > 0 ? Service.find({ _id: { $in: serviceIds } }) : [],
      equipmentIds.length > 0 ? Equipment.find({ _id: { $in: equipmentIds } }) : [],
      packageIds.length > 0 ? Package.find({ _id: { $in: packageIds } }).populate('services equipments') : [],
      helperIds.length > 0 ? Helper.find({ _id: { $in: helperIds } }) : []
    ]);


    
    

    res.json({
      success: true,
      data: {
        services,
        equipments,
        packages,
        helpers
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Get individual item details
 */
// const getIndividualItemDetails = async (req, res) => {
//   try {
//     const { type, id } = req.params;
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid ID',
//         message: 'Invalid MongoDB ObjectId'
//       });
//     }

//     let item = null;
    
//     switch (type.toLowerCase()) {
//       case 'service':
//         item = await Service.findById(id);
//         break;
//       case 'equipment':
//         item = await Equipment.findById(id);
//         break;
//       case 'package':
//         item = await Package.findById(id).populate('services equipments');
//         break;
//       case 'helper':
//         item = await Helper.findById(id);
//         break;
//       default:
//         return res.status(400).json({
//           success: false,
//           error: 'Invalid type',
//           message: 'Type must be one of: service, equipment, package, helper'
//         });
//     }

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         error: 'Item not found',
//         message: `${type} not found`
//       });
//     }

//     res.json({
//       success: true,
//       data: {
//         [type]: item
//       }
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//       message: error.message
//     });
//   }
// };

export   {
  getCartItemDetails,
//   getIndividualItemDetails
};