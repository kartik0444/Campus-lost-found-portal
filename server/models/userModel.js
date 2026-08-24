const { runQuery, getQuery, allQuery } = require('../config/db');

const UserModel = {
  async findByEmail(email) {
    return await getQuery(`SELECT * FROM users WHERE email = ?`, [email]);
  },

  async findById(id) {
    return await getQuery(`SELECT id, name, email, role, createdAt FROM users WHERE id = ?`, [id]);
  },

  async create(name, email, password, role = 'student') {
    const result = await runQuery(
      `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
      [name, email, password, role]
    );
    return result.lastID;
  },

  async getAllUsers() {
    return await allQuery(`SELECT id, name, email, role, createdAt FROM users ORDER BY createdAt DESC`);
  }
};

module.exports = UserModel;
