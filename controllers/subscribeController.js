const Subscribe = require('../models/subscribe');

exports.submitForm = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if email already exists
    const existingEmail = await Subscribe.findOne({ email });
    if (existingEmail) {
      return res.status(200).json({
        success: true,
        message: 'Email already subscribed'
      });
    }

    // Create new subscription
    const newSubmission = new Subscribe({
      email,
      subscribedAt: new Date()
    });

    await newSubmission.save();

    res.status(201).json({
      success: true,
      message: 'Email subscribed successfully',
      data: newSubmission
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error subscribing email. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
    
