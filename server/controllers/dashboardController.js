const ItemModel = require('../models/itemModel');

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get posts created by logged in user
    const userItems = await ItemModel.getByUserId(userId);

    // Get stats
    const globalStats = await ItemModel.getStats();
    const userStats = await ItemModel.getUserStats(userId);

    res.status(200).json({
      stats: {
        totalLost: globalStats.totalLost,
        totalFound: globalStats.totalFound,
        totalItems: globalStats.totalItems,
        userLost: userStats.userLost,
        userFound: userStats.userFound,
        userTotal: userStats.userTotal
      },
      userItems
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Failed to load dashboard data.' });
  }
};

module.exports = {
  getDashboardData
};
