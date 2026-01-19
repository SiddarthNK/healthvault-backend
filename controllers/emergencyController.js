const Emergency = require('../models/Emergency');

// @desc    Get emergency data
// @route   GET /api/emergency
// @access  Private
const getEmergencyData = async (req, res) => {
    try {
        const emergencyData = await Emergency.findOne({ user: req.user._id });
        if (emergencyData) {
            res.json(emergencyData);
        } else {
            res.status(404).json({ message: 'Emergency data not found' });
        }
    } catch (error) {
        console.error('Emergency Data DB Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create or Update emergency data
// @route   POST /api/emergency
// @access  Private
const updateEmergencyData = async (req, res) => {
    const { bloodType, allergies, medications, medicalConditions, contacts } = req.body;

    try {
        let emergencyData = await Emergency.findOne({ user: req.user._id });

        if (emergencyData) {
            // Update
            emergencyData.bloodType = bloodType || emergencyData.bloodType;
            emergencyData.allergies = allergies || emergencyData.allergies;
            emergencyData.medications = medications || emergencyData.medications;
            emergencyData.medicalConditions = medicalConditions || emergencyData.medicalConditions;
            emergencyData.contacts = contacts || emergencyData.contacts;

            const updatedData = await emergencyData.save();
            res.json(updatedData);
        } else {
            // Create
            emergencyData = new Emergency({
                user: req.user._id,
                bloodType,
                allergies,
                medications,
                medicalConditions,
                contacts,
            });

            const createdData = await emergencyData.save();
            res.status(201).json(createdData);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getEmergencyData, updateEmergencyData };
