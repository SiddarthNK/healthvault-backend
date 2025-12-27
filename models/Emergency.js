const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    bloodType: {
        type: String,
        required: true,
    },
    allergies: [String],
    medications: [String],
    medicalConditions: [String],
    contacts: [{
        name: String,
        relation: String,
        phone: String,
        type: { type: String, enum: ['Doctor', 'Family', 'Pharmacy', 'Other'], default: 'Family' }
    }],
}, {
    timestamps: true,
});

const Emergency = mongoose.model('Emergency', emergencySchema);

module.exports = Emergency;
