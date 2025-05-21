const express = require('express');
const router = express.Router();
const PageContent = require('../models/PageContent');
const auth = require('../middleware/auth');

// Get content for a specific page
router.get('/:pageId', auth, async (req, res) => {
  try {
    const pageContent = await PageContent.findOne({ pageId: req.params.pageId });
    if (!pageContent) {
      // Create initial content if it doesn't exist
      const newPageContent = new PageContent({
        pageId: req.params.pageId,
        content: '',
        updatedBy: req.admin._id
      });
      await newPageContent.save();
      return res.json({ content: '' });
    }
    res.json({ content: pageContent.content });
  } catch (error) {
    console.error('Error fetching page content:', error);
    res.status(500).json({ message: 'Error fetching page content', error: error.message });
  }
});

// Update content for a specific page
router.put('/:pageId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const pageContent = await PageContent.findOneAndUpdate(
      { pageId: req.params.pageId },
      { 
        content,
        lastUpdated: Date.now(),
        updatedBy: req.admin._id
      },
      { 
        new: true,
        upsert: true // Create if doesn't exist
      }
    );

    res.json({ 
      message: 'Content updated successfully',
      content: pageContent.content
    });
  } catch (error) {
    console.error('Error updating page content:', error);
    res.status(500).json({ message: 'Error updating page content', error: error.message });
  }
});

// Get all pages content (for admin dashboard)
router.get('/', auth, async (req, res) => {
  try {
    const pagesContent = await PageContent.find()
      .select('pageId content lastUpdated')
      .sort('pageId');
    res.json(pagesContent);
  } catch (error) {
    console.error('Error fetching all pages content:', error);
    res.status(500).json({ message: 'Error fetching pages content', error: error.message });
  }
});

module.exports = router; 