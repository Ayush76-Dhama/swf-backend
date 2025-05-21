const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema({
  pageId: {
    type: String,
    required: true,
    unique: true,
    enum: ['home', 'about', 'impact', 'campaigns', 'gallery', 'contact', 'vision-mission', 'supporters']
  },
  content: {
    type: String,
    required: true,
    default: ''
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
});

module.exports = mongoose.model('PageContent', pageContentSchema); 