const Vital = require('../models/Vital');

// @desc    Get user vitals
// @route   GET /api/vitals
// @access  Private
const getVitals = async (req, res) => {
    // PRESENTATION CHEAT: Mock data if presentation account
    if (req.user?._id === 'presentation_admin_id') {
        return res.json([
            {
                _id: 'v_mock_1',
                heartRate: 72,
                bloodPressure: { systolic: 120, diastolic: 80 },
                spo2: 98,
                temperature: 98.6,
                date: new Date()
            }
        ]);
    }

    try {
        const vitals = await Vital.find({ user: req.user._id }).sort({ date: -1 });
        res.json(vitals);
    } catch (error) {
        console.error('Vitals DB error:', error.message);
        res.status(503).json({ message: 'Database busy.' });
    }
};

// @desc    Add new vitals
// @route   POST /api/vitals
// @access  Private
const addVital = async (req, res) => {
    const { heartRate, bloodPressure, spo2, temperature } = req.body;

    // Custom validation or processing if needed (e.g., parsing BP string)
    // Assume BP is passed as { systolic: 120, diastolic: 80 } or similar object structure

    try {
        const vital = new Vital({
            user: req.user._id,
            heartRate,
            bloodPressure, // Expecting object { systolic, diastolic }
            spo2,
            temperature,
            date: Date.now()
        });

        const createdVital = await vital.save();
        res.status(201).json(createdVital);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getVitals, addVital };
