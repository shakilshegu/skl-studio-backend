import Helper from '../../models/partner/helper.Model.js';
import partnerStudios from "../../models/partner/studio.Model.js";

// GET all helpers
export const getHelpers = async (req, res) => {
  try {
    const helpers = await Helper.find();
    res.status(200).json(helpers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch helpers' });
  }
};

// POST create a helper
export const createHelper = async (req, res) => {
  try {

    const userId = req.user._id;
    
    const studio = await partnerStudios.findOne({ "owner.userId": userId });
    if (!studio) {
      return res.status(404).json({
        success: false,
        message: "Studio not found.",
      });
    }



    const { name, description, price } = req.body;

    const newHelper = new Helper({  studioId: studio._id,name, description, price });
    await newHelper.save();

    res.status(201).json(newHelper);
  } catch (error) {
    console.log(error);
    
    res.status(400).json({ message: 'Failed to create helper' });
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
