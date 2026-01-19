const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

dotenv.config();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: [
        'https://healthvault-frontend-u2ch.vercel.app',
        'https://healthvault-frontend.vercel.app',
        'http://localhost:5173'
    ],
    credentials: true
}));

// Global Mongoose Configuration for Stability
mongoose.set('bufferCommands', true); // Re-enable buffering so brief blips don't cause immediate UI errors
mongoose.set('strictQuery', false);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const states = {
        0: 'Disconnected',
        1: 'Connected',
        2: 'Connecting',
        3: 'Disconnecting'
    };
    res.json({
        status: dbState === 1 ? 'UP' : 'DOWN',
        database: states[dbState],
        timestamp: new Date()
    });
});

// Database Connection
const connectDB = async () => {
    const connOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4 // Force IPv4 to avoid potential local DNS/IPv6 issues
    };

    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is not defined in .env file');
            return;
        }

        console.log('Attempting to connect to MongoDB...');

        // Listen for connection events
        mongoose.connection.on('error', err => {
            console.error('Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected. Attempting to reconnect...');
        });

        await mongoose.connect(process.env.MONGO_URI, connOptions);
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.error('MongoDB Connection Error Details:');
        console.error('Code:', err.code);
        console.error('Message:', err.message);

        if (err.message.includes('ECONNREFUSED')) {
            console.error('TIP: Connectivity issue. Check if your current IP is whitelisted in MongoDB Atlas.');
        } else if (err.message.includes('querySrv')) {
            console.error('TIP: DNS resolution issue. Try using the direct node connection string or check your DNS settings.');
        }

        // Initial connection failed, retry after 5 seconds
        console.log('Retrying MongoDB connection in 5 seconds...');
        setTimeout(connectDB, 5000);
    }
};

connectDB();

// Routes (Placeholder)
app.get('/', (req, res) => {
    res.send('HealthVault Pro API is running');
});

const authRoutes = require('./routes/auth');
const vitalRoutes = require('./routes/vital');
const emergencyRoutes = require('./routes/emergency');
const healthRecordRoutes = require('./routes/healthRecord');
const appointmentRoutes = require('./routes/appointment');
const documentRoutes = require('./routes/document');

app.use('/api/auth', authRoutes);
app.use('/api/vitals', vitalRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/records', healthRecordRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/documents', documentRoutes);

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
