require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const cors = require('cors');
const bootstrapAdmin = require("./utils/bootstrapAdmin");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // Allow specific frontend or all if not set
    credentials: true,
}));

// Routes
app.use('/api/images', require('./routes/imageRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// Basic Route
app.get('/', (req, res) => {
    res.send('Gaurav Collection API is running...');
});


const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB connected");

        await bootstrapAdmin();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Server startup failed:", err.message);
        process.exit(1);
    }
};

startServer();