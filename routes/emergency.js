const express = require('express');
const { getEmergencyData, updateEmergencyData } = require('../controllers/emergencyController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getEmergencyData).post(protect, updateEmergencyData);

module.exports = router;
