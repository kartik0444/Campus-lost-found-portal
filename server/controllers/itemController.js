const ItemModel = require('../models/itemModel');
const path = require('path');
const fs = require('fs');

// GET /api/items (supports search, category, type filter)
const getItems = async (req, res) => {
  try {
    const { search, category, type } = req.query;
    const items = await ItemModel.getAll({ search, category, type });
    res.status(200).json({ items });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Failed to retrieve items.' });
  }
};

// GET /api/items/:id
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ItemModel.getById(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    res.status(200).json({ item });
  } catch (error) {
    console.error('Error fetching item details:', error);
    res.status(500).json({ message: 'Failed to retrieve item details.' });
  }
};

// POST /api/items
const createItem = async (req, res) => {
  try {
    const { title, description, category, type, location, date, contact } = req.body;
    const userId = req.user.id;

    if (!title || !description || !category || !type || !location || !date || !contact) {
      return res.status(400).json({ message: 'All required item fields must be provided.' });
    }

    let imagePath = '';
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
    }

    const itemId = await ItemModel.create({
      title: title.trim(),
      description: description.trim(),
      category,
      type,
      location: location.trim(),
      date,
      image: imagePath,
      contact: contact.trim(),
      userId
    });

    const newItem = await ItemModel.getById(itemId);
    res.status(201).json({
      message: `${type} item posted successfully!`,
      item: newItem
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Failed to post item.' });
  }
};

// PUT /api/items/:id
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const existingItem = await ItemModel.getById(id);

    if (!existingItem) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    // Check ownership or admin
    if (existingItem.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized. You can only edit your own posts.' });
    }

    const { title, description, category, type, location, date, contact } = req.body;

    let imagePath = existingItem.image;
    if (req.file) {
      // Remove old image file if it exists locally
      if (existingItem.image && existingItem.image.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', existingItem.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      imagePath = '/uploads/' + req.file.filename;
    }

    await ItemModel.update(id, {
      title: title ? title.trim() : existingItem.title,
      description: description ? description.trim() : existingItem.description,
      category: category || existingItem.category,
      type: type || existingItem.type,
      location: location ? location.trim() : existingItem.location,
      date: date || existingItem.date,
      image: imagePath,
      contact: contact ? contact.trim() : existingItem.contact
    });

    const updatedItem = await ItemModel.getById(id);
    res.status(200).json({
      message: 'Item updated successfully!',
      item: updatedItem
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Failed to update item.' });
  }
};

// DELETE /api/items/:id
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const existingItem = await ItemModel.getById(id);

    if (!existingItem) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    // Check ownership or admin
    if (existingItem.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized. You can only delete your own posts.' });
    }

    // Remove local image file if present
    if (existingItem.image && existingItem.image.startsWith('/uploads/')) {
      const imgPath = path.join(__dirname, '..', existingItem.image);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await ItemModel.delete(id);
    res.status(200).json({ message: 'Item deleted successfully.' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Failed to delete item.' });
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};
