const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('About', aboutSchema); 