const express = require('express');
const { getHealthRecords, addHealthRecord } = require('../controllers/healthRecordController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const upload = require('../utils/fileUpload');

router.route('/').get(protect, getHealthRecords).post(protect, upload.any(), addHealthRecord);

module.exports = router;
