import EquipmentCategory from '../../models/partner/equipmentCategory.Model.js';

// Add a new category
export const addCategory = async (req, res) => {
  try {
    const category = new EquipmentCategory(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an existing category
export const updateCategory = async (req, res) => {
  try {
    const category = await EquipmentCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const category = await EquipmentCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await EquipmentCategory.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
