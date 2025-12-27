const express = require('express');
const { uploadDocument, getDocuments } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const upload = require('../utils/fileUpload');

router.route('/').get(protect, getDocuments).post(protect, upload.single('file'), uploadDocument);

module.exports = router;
