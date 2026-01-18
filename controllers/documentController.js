const Document = require('../models/Document');
const multer = require('multer');
const path = require('path');
const fs = require('fs');



// @desc    Upload a new document
// @route   POST /api/documents
// @access  Private
// @desc    Upload a new document
// @route   POST /api/documents
// @access  Private
const uploadDocument = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file selected' });
    }

    const { title, category } = req.body;

    try {
        const document = new Document({
            user: req.user._id,
            title,
            category,
            fileUrl: `/${req.file.path.replace(/\\/g, '/')}`, // URL to access file
            fileSize: (req.file.size / (1024 * 1024)).toFixed(2) + ' MB',
            fileType: path.extname(req.file.originalname).substring(1).toUpperCase()
        });

        const createdDocument = await document.save();
        res.status(201).json(createdDocument);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { uploadDocument, getDocuments };
