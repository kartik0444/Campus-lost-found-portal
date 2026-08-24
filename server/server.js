const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDB } = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS configuration
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Student Lost & Found Portal API is running cleanly!',
    timestamp: new Date().toISOString()
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the Student Lost & Found Portal REST API');
});

// Start server after DB initialization
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(` Server running on: http://localhost:${PORT}`);
    console.log(` Client URL configured: ${CLIENT_URL}`);
    console.log(` API Endpoints mounted under /api/`);
    console.log(` Static Uploads served at http://localhost:${PORT}/uploads/`);
    console.log(`=================================================`);
  });
}).catch((err) => {
  console.error('Failed to start server due to DB initialization error:', err);
});
