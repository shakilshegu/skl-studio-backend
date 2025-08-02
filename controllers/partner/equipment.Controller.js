import Equipment from "../../models/partner/equipment.model.js";
import partnerStudios from "../../models/partner/Studio.model.js";
import { getS3FileUrl, uploadFile } from "../../utils/media.helper.js";
import { sendResponse } from "../../utils/responseUtils.js";
import { getEntityId } from "../../utils/roleUtils.js";
// import { validationResult } from "express-validator";
// import EquipmentCategory from "../../models/partner/equipmentCategory.Model.js";
// import { equipmentCategory } from "../../middleware/validation.middleware.js";

// Add new equipment
// const addEquipment = async (req, res) => {
//   try {
//     const { category, price, desc, name } = req.body;


// let test_category="67f76c5ec82e247878cb6646"

//     const file = req.file;
//     if (!file) {
//       return res.status(404).json({
//         success: false,
//         message: "Photo required",
//       });
//     }
//     const userId = req.user._id;
//     const studio = await partnerStudios.findOne({ "owner.userId": userId });
//     if (!studio) {
//       return res.status(404).json({
//         success: false,
//         message: "Studio not found.",
//       });
//     }
//     const photoUrl = await uploadFile(file, `equipments/${studio._id}/${file.filename}`);
//     const equipment = new Equipment({
//       type:test_category,
//       name,
//       price,
//       description:desc,
//       photo: photoUrl,
//       studioId: studio._id,
//     });


//     await equipment.save();
//    return res.status(201).json(equipment);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };


const addEquipment = async (req, res) => {
  try {
    const { category, price, desc, name } = req.body;
    const file = req.file;
    const test_category = "67f76c5ec82e247878cb6646";

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Photo required",
      });
    }

    // Get the entity ID and type (studio or freelancer)
    const { entityId, entityType } = await getEntityId(req);

    // Upload the equipment photo
    const photoUrl = await uploadFile(file, `equipments/${entityId}/${file.filename}`);

    // Create a new equipment entry
    const equipment = new Equipment({
      type: test_category,
      name,
      price,
      description: desc,
      photo: photoUrl,
      [`${entityType}Id`]: entityId,  // Dynamic assignment (studioId or freelancerId)
    });

    await equipment.save();
    return res.status(201).json({ success: true, data: equipment });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};





// Update Equipment Function
const updateEquipment = async (req, res) => {
  try {
    const  equipmentId  = req.params.id;
    
    const { category, price, desc, name } = req.body;
    const file = req.file;

    if (!equipmentId) {
      return res.status(400).json({ message: "Equipment ID is required." });
    }

    const equipment = await Equipment.findById(equipmentId);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found." });
    }

    if (file) {
      const photoUrl = await uploadFile(
        file,
        `equipment/${file.filename}`
      );
      equipment.photo = photoUrl;
    }

   
    equipment.name = name || equipment.name;
    equipment.category = category || equipment.category;
    equipment.price = price || equipment.price;
    equipment.description = desc || equipment.description;
   

    const updatedEquipment = await equipment.save();
    return sendResponse(
      res,
      true,
      "Equipment updated successfully.",
      updatedEquipment
    );
  } catch (error) {
    console.error(error.message);
    return sendResponse(
      res,
      false,
      "Error updating equipment",
      null,
      error.message
    );
  }
};

// Get equipment by filter
const getEquipmentByFilter = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, ratings, name } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (minPrice) filter.price = { $gte: minPrice };
    if (maxPrice) filter.price = { ...filter.price, $lte: maxPrice };
    if (ratings) filter["reviews.rating"] = { $gte: ratings };
    if (name) filter.name = new RegExp(name, "i");

    const equipments = await Equipment.find(filter);
    res.status(200).json(equipments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const getEquipmentsByPartnerId = async (req, res) => {
//   try {
//     const userId = req.user._id
//     const studio = await partnerStudios.findOne({ "owner.userId" : userId });
//     if (!studio) {
//       return res.status(404).json({ 
//         success: true,
//         message: 'Studio not found.' 
//       });
//     }
//     const equipments = await Equipment.find({ studioId:studio._id });
//     res.status(200).json(equipments);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const getEquipmentsByPartnerId = async (req, res) => {
  try {
    // Get the entity ID and type (studio or freelancer)
    const { entityId, entityType } = await getEntityId(req);

    // Fetch equipments based on the entity ID
    const equipments = await Equipment.find({ [`${entityType}Id`]: entityId,isDeleted: false });

    if (!equipments.length) {
      return res.status(200).json({
        success: true,
        message: `No Equipments found for this ${entityType}.`,
        data: []
      });
    }    

    res.status(200).json({ success: true, data: equipments });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
const deleteEquipment = async (req, res) => {
  try {
    const  equipmentId  = req.params.id;

    // Fetch equipments based on the entity ID
    const equipment = await Equipment.findById(equipmentId);

        if (!equipment || equipment.isDeleted) {
          return sendResponse(res, false, 'equipment not found or already deleted', null);
        }

    equipment.isDeleted = true;
    await equipment.save();
    return sendResponse(res, true, 'Equipment deleted successfully', null);  

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};



export {
  addEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentByFilter,
  getEquipmentsByPartnerId,
};
