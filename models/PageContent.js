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

mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');

  // Example of creating a new PageContent
  const PageContent = require('./models/PageContent');
  const newPageContent = new PageContent({
    pageId: 'home',
    content: 'Welcome to the home page!',
    updatedBy: 'yourAdminObjectIdHere' // Replace with a valid ObjectId
  });

  return newPageContent.save();
})
.then(() => console.log('Page content saved successfully'))
.catch(err => console.error('Error:', err))
.finally(() => mongoose.connection.close()); 