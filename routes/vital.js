const express = require('express');
const { getVitals, addVital } = require('../controllers/vitalController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getVitals).post(protect, addVital);

module.exports = router;
