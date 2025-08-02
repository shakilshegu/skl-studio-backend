import Helper from '../../models/partner/helper.model.js';
import partnerStudios from "../../models/partner/studio.model.js";
import { sendResponse } from '../../utils/responseUtils.js';
import { getEntityId } from '../../utils/roleUtils.js';

// GET all helpers
export const getHelpersByPartnerId = async (req, res) => {
  try {
    // Get the entity ID and type (studio or freelancer)
    const { entityId, entityType } = await getEntityId(req); 
    // Fetch helpers based on the entity ID
    const helpers = await Helper.find({ 
      [`${entityType}Id`]: entityId,
      isDeleted: false 
    });
    
    if (!helpers.length) {
      return res.status(200).json({
        success: true,
        message: `No Helpers found for this ${entityType}.`,
        data: []
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Helpers retrieved successfully.",
      data: helpers
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching helpers",
      error: error.message
    });
  }
};

// POST create a helper
export const addHelperById = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    
    // Get the entity ID and type (studio or freelancer)
    const { entityId, entityType } = await getEntityId(req);
    
    // Create and save the new helper
    const newHelper = new Helper({
      name,
      price,
      description,
      [`${entityType}Id`]: entityId, // dynamically set studioId or freelancerId
    });
    
    const savedHelper = await newHelper.save();
    return sendResponse(res, true, 'Helper added successfully.', savedHelper);
  } catch (error) {
    console.error(error.message);
    return sendResponse(res, false, 'Error adding helper', null, error.message);
  }
};

// PUT update a helper
export const updateHelper = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedHelper = await Helper.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedHelper) {
      return res.status(404).json({ message: 'Helper not found' });
    }

    res.status(200).json(updatedHelper);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update helper' });
  }
};

// DELETE a helper
export const deleteHelper = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedHelper = await Helper.findByIdAndDelete(id);

    if (!deletedHelper) {
      return res.status(404).json({ message: 'Helper not found' });
    }

    res.status(200).json({ message: 'Helper deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete helper' });
  }
};
