const HealthRecord = require('../models/HealthRecord');

// @desc    Get user health records
// @route   GET /api/records
// @access  Private
const getHealthRecords = async (req, res) => {
    try {
        const records = await HealthRecord.find({ user: req.user._id }).sort({ date: -1 });
        res.json(records);
    } catch (error) {
        console.error('Health Records DB error:', error.message);
        res.status(503).json({ message: 'Database busy. Try again later.' });
    }
};

// @desc    Add new health record
// @route   POST /api/records
// @access  Private
const addHealthRecord = async (req, res) => {
    console.log('Adding Health Record Body:', req.body);
    console.log('Adding Health Record Files:', req.files);

    const { title, date, provider, description, category } = req.body;
    let attachment = req.body.attachment;

    // With upload.any(), files are in req.files array
    if (req.files && req.files.length > 0) {
        attachment = `/${req.files[0].path.replace(/\\/g, '/')}`;
    }

    try {
        const record = new HealthRecord({
            user: req.user._id,
            title,
            date,
            provider,
            description,
            category,
            attachment, // Saved as URL path
        });

        const createdRecord = await record.save();
        res.status(201).json(createdRecord);
    } catch (error) {
        console.error('Error adding record:', error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getHealthRecords, addHealthRecord };
