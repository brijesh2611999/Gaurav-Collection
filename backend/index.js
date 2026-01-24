require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const cors = require('cors');
const bootstrapAdmin = require("./utils/bootstrapAdmin");

const app = express();

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'https://gaurav-collection.vercel.app',
            'http://localhost:3000',
        ];

        if (process.env.FRONTEND_URL) {
            allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ''));
        }

        // Remove trailing slash from the current origin for comparison
        const currentOrigin = origin ? origin.replace(/\/$/, '') : '';

        if (!origin || allowedOrigins.includes(currentOrigin)) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

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