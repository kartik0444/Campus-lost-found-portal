const { runQuery, getQuery, allQuery } = require('../config/db');

const ItemModel = {
  async getAll({ search, category, type } = {}) {
    let sql = `
      SELECT items.*, users.name as posterName, users.email as posterEmail
      FROM items
      JOIN users ON items.userId = users.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (items.title LIKE ? OR items.description LIKE ? OR items.location LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (category && category !== 'All') {
      sql += ` AND items.category = ?`;
      params.push(category);
    }

    if (type && type !== 'All') {
      sql += ` AND items.type = ?`;
      params.push(type);
    }

    sql += ` ORDER BY items.createdAt DESC`;
    return await allQuery(sql, params);
  },

  async getById(id) {
    const sql = `
      SELECT items.*, users.name as posterName, users.email as posterEmail
      FROM items
      JOIN users ON items.userId = users.id
      WHERE items.id = ?
    `;
    return await getQuery(sql, [id]);
  },

  async getByUserId(userId) {
    const sql = `
      SELECT * FROM items WHERE userId = ? ORDER BY createdAt DESC
    `;
    return await allQuery(sql, [userId]);
  },

  async create(data) {
    const { title, description, category, type, location, date, image, contact, userId } = data;
    const result = await runQuery(
      `INSERT INTO items (title, description, category, type, location, date, image, contact, userId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, category, type, location, date, image || '', contact, userId]
    );
    return result.lastID;
  },

  async update(id, data) {
    const { title, description, category, type, location, date, image, contact } = data;
    let sql = `
      UPDATE items
      SET title = ?, description = ?, category = ?, type = ?, location = ?, date = ?, contact = ?
    `;
    const params = [title, description, category, type, location, date, contact];

    if (image !== undefined) {
      sql += `, image = ?`;
      params.push(image);
    }

    sql += ` WHERE id = ?`;
    params.push(id);

    return await runQuery(sql, params);
  },

  async delete(id) {
    return await runQuery(`DELETE FROM items WHERE id = ?`, [id]);
  },

  async getStats() {
    const lostCount = await getQuery(`SELECT COUNT(*) as count FROM items WHERE type = 'Lost'`);
    const foundCount = await getQuery(`SELECT COUNT(*) as count FROM items WHERE type = 'Found'`);
    const totalCount = await getQuery(`SELECT COUNT(*) as count FROM items`);
    return {
      totalLost: lostCount.count,
      totalFound: foundCount.count,
      totalItems: totalCount.count
    };
  },

  async getUserStats(userId) {
    const lostCount = await getQuery(`SELECT COUNT(*) as count FROM items WHERE userId = ? AND type = 'Lost'`, [userId]);
    const foundCount = await getQuery(`SELECT COUNT(*) as count FROM items WHERE userId = ? AND type = 'Found'`, [userId]);
    const totalCount = await getQuery(`SELECT COUNT(*) as count FROM items WHERE userId = ?`, [userId]);
    return {
      userLost: lostCount.count,
      userFound: foundCount.count,
      userTotal: totalCount.count
    };
  }
};

module.exports = ItemModel;
