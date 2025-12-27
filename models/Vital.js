const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    heartRate: {
        type: Number,
        required: true,
    },
    bloodPressure: {
        systolic: { type: Number, required: true },
        diastolic: { type: Number, required: true },
    },
    spo2: {
        type: Number,
        required: true,
    },
    temperature: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Vital = mongoose.model('Vital', vitalSchema);

module.exports = Vital;
