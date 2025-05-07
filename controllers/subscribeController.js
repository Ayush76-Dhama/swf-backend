const Subscribe = require('../models/subscribe');

exports.submitForm = async (req, res) => {
  try {
    const { email } = req.body;

    const existingEmail = await Subscribe.findOne({ email });

    const newSubmission = new Subscribe({
      email
    });

    await newSubmission.save();

    res.status(201).json({
      success: true,
      message: 'Email subscribed successfully',
      data: newSubmission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error subscribing email',
      error: error.message
    });
  }
};
    
