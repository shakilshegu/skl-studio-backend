import StudioCategory from '../../models/partner/studioCategories.Model.js';
import { uploadFile } from '../../utils/mediaHelper.js';

export const addStudioCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    if (!name  && !file) {
      return res.status(400).json({ message: 'Name or image is required' });
    }
   
    const uploadedFilePath = await uploadFile(file, `studioCategory/${file.filename}`);

    const newCategory = new StudioCategory({ name, image: uploadedFilePath, });
    await newCategory.save();

    res.status(201).json({ message: 'Studio category added successfully', data: newCategory });
  } catch (error) {
    console.error('Error adding studio category:', error);
    res.status(500).json({ message: 'An error occurred while adding the studio category', error: error.message });
  }
};

export const getStudioCategories = async (req, res) => {
  try {
    const categories = await StudioCategory.find();

    res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching studio categories:', error);
    res.status(500).json({ message: 'An error occurred while fetching studio categories', error: error.message });
  }
}


export const updateStudioCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const file = req.file;

    if (!name && !file) {
      return res.status(400).json({ message: 'Name or image is requiredd' });
    }
    const updateData = {};
    if (name) updateData.name = name;
    if (file) {
      const uploadedFilePath = await uploadFile(file, `studio/${file.filename}`);
      updateData.image = uploadedFilePath; 
    }
    const updatedCategory = await StudioCategory.findByIdAndUpdate(id,updateData, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Studio category not found' });
    }

    res.status(200).json({ message: 'Studio category updated successfully', data: updatedCategory });
  } catch (error) {
    console.error('Error updating studio category:', error);
    res.status(500).json({ message: 'An error occurred while updating the studio category', error: error.message });
  }
};
