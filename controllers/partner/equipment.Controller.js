import Equipment from "../../models/partner/equipment.Model.js";
import partnerStudios from "../../models/partner/studio.Model.js";
import { getS3FileUrl, uploadFile } from "../../utils/mediaHelper.js";
import { sendResponse } from "../../utils/responseUtils.js";
import { validationResult } from "express-validator";
import EquipmentCategory from "../../models/partner/equipmentCategory.Model.js";
import { equipmentCategory } from "../../middleware/validation.middleware.js";

// Add new equipment
const addEquipment = async (req, res) => {
  try {
    const { category, price, desc, name } = req.body;
console.log(req.body,"rrr");


let test_category="67f76c5ec82e247878cb6646"

    const file = req.file;
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Photo required",
      });
    }
    const userId = req.user._id;
    const studio = await partnerStudios.findOne({ "owner.userId": userId });
    if (!studio) {
      return res.status(404).json({
        success: false,
        message: "Studio not found.",
      });
    }
    const photoUrl = await uploadFile(file, `equipments/${studio._id}/${file.filename}`);
    const equipment = new Equipment({
      type:test_category,
      name,
      price,
      description:desc,
      photo: photoUrl,
      studioId: studio._id,
    });


    await equipment.save();
   return res.status(201).json(equipment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Equipment Function
const updateEquipment = async (req, res) => {
  try {
    const { equipmentId } = req.params;
    const { type, name, brand, model, description, studioId } = req.body;
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
        `studioEquipment/${file.filename}`
      );
      equipment.photo = photoUrl;
    }

    equipment.type = type || equipment.type;
    equipment.name = name || equipment.name;
    equipment.brand = brand || equipment.brand;
    equipment.model = model || equipment.model;
    equipment.description = description || equipment.description;
    equipment.studioId = studioId || equipment.studioId;

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

const getEquipmentsByStudioId = async (req, res) => {
  try {
    const userId = req.user._id
    const studio = await partnerStudios.findOne({ "owner.userId" : userId });
    if (!studio) {
      return res.status(404).json({ 
        success: false,
        message: 'Studio not found.' 
      });
    }
    const equipments = await Equipment.find({ studioId:studio._id });
    res.status(200).json(equipments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  addEquipment,
  updateEquipment,
  getEquipmentByFilter,
  getEquipmentsByStudioId,
};
