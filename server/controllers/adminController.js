const UserModel = require('../models/userModel');
const ItemModel = require('../models/itemModel');
const path = require('path');
const fs = require('fs');

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users for admin:', error);
    res.status(500).json({ message: 'Failed to retrieve registered users.' });
  }
};

const getAllItems = async (req, res) => {
  try {
    const items = await ItemModel.getAll();
    res.status(200).json({ items });
  } catch (error) {
    console.error('Error fetching items for admin:', error);
    res.status(500).json({ message: 'Failed to retrieve posts for admin.' });
  }
};

const adminDeleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ItemModel.getById(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    if (item.image && item.image.startsWith('/uploads/')) {
      const imgPath = path.join(__dirname, '..', item.image);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await ItemModel.delete(id);
    res.status(200).json({ message: 'Post successfully deleted by admin.' });
  } catch (error) {
    console.error('Error deleting item by admin:', error);
    res.status(500).json({ message: 'Failed to delete post.' });
  }
};

module.exports = {
  getAllUsers,
  getAllItems,
  adminDeleteItem
};
