const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Helper for promise-based queries
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize database tables & seed initial data
const initDB = async () => {
  try {
    // Create Users table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'student',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Items table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        type TEXT NOT NULL,
        location TEXT NOT NULL,
        date TEXT NOT NULL,
        image TEXT,
        contact TEXT NOT NULL,
        userId INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Seed default admin user if not exists
    const adminExists = await getQuery(`SELECT * FROM users WHERE email = ?`, ['admin@campus.edu']);
    let adminId;
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const res = await runQuery(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        ['Campus Admin', 'admin@campus.edu', hashedPassword, 'admin']
      );
      adminId = res.lastID;
      console.log('Seeded default admin user: admin@campus.edu / admin123');
    } else {
      adminId = adminExists.id;
    }

    // Seed default student user if not exists
    const studentExists = await getQuery(`SELECT * FROM users WHERE email = ?`, ['alex@student.edu']);
    let studentId;
    if (!studentExists) {
      const hashedPassword = await bcrypt.hash('student123', 10);
      const res = await runQuery(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        ['Alex Johnson', 'alex@student.edu', hashedPassword, 'student']
      );
      studentId = res.lastID;
      console.log('Seeded default student user: alex@student.edu / student123');
    } else {
      studentId = studentExists.id;
    }

    // Seed sample items if items table is empty
    const itemCounts = await getQuery(`SELECT COUNT(*) as count FROM items`);
    if (itemCounts.count === 0) {
      const sampleItems = [
        {
          title: 'Blue Water Bottle (Hydro Flask)',
          description: 'Dark blue 32oz Hydro Flask with university stickers on the side.',
          category: 'Accessories',
          type: 'Lost',
          location: 'Central Library, 2nd Floor Quiet Zone',
          date: '2026-08-03',
          image: '',
          contact: '+1 (555) 234-5678',
          userId: studentId
        },
        {
          title: 'MacBook Air M2 (Silver)',
          description: 'Found a silver 13-inch MacBook Air left on desk #14 in Computer Lab B.',
          category: 'Electronics',
          type: 'Found',
          location: 'Engineering Building, Room 204',
          date: '2026-08-04',
          image: '',
          contact: '+1 (555) 987-6543',
          userId: adminId
        },
        {
          title: 'Student ID Card - Sarah Miller',
          description: 'Student identification card found near the main campus cafeteria entrance.',
          category: 'ID Cards',
          type: 'Found',
          location: 'Student Union Cafeteria Entrance',
          date: '2026-08-04',
          image: '',
          contact: '+1 (555) 876-5432',
          userId: adminId
        },
        {
          title: 'Calculus III Textbook & Notebook',
          description: 'Hardcover Stewart Calculus book along with a green spiral notebook.',
          category: 'Books',
          type: 'Lost',
          location: 'Science Auditorium Lecture Hall 3',
          date: '2026-08-02',
          image: '',
          contact: '+1 (555) 345-6789',
          userId: studentId
        },
        {
          title: 'Set of Car Keys with Leather Keychain',
          description: 'Toyota key fob with a dark brown leather strap and small brass key.',
          category: 'Keys',
          type: 'Found',
          location: 'North Campus Parking Lot B',
          date: '2026-08-05',
          image: '',
          contact: '+1 (555) 654-3210',
          userId: adminId
        }
      ];

      for (const item of sampleItems) {
        await runQuery(
          `INSERT INTO items (title, description, category, type, location, date, image, contact, userId)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [item.title, item.description, item.category, item.type, item.location, item.date, item.image, item.contact, item.userId]
        );
      }
      console.log('Seeded sample lost & found items.');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = {
  db,
  runQuery,
  getQuery,
  allQuery,
  initDB
};
