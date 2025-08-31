const express = require('express');
const { /* connectMongoDB, */ connectPostgreSQL } = require('./config/database');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth-prisma');
const ideaRoutes = require('./routes/ideas');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ 
    limit: process.env.MAX_FILE_SIZE || '10mb',
    strict: true
}));
app.use(express.urlencoded({ 
    extended: true, 
    limit: process.env.MAX_FILE_SIZE || '10mb'
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);

// Connect to databases
// connectMongoDB();
connectPostgreSQL();

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
