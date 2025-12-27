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
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

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
