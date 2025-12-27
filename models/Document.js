const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    fileSize: {
        type: String,
    },
    fileType: {
        type: String,
    },
}, {
    timestamps: true,
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
