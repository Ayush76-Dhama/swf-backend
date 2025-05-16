const JoinUs = require('../models/JoinUs');

exports.submitForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    const newSubmission = new JoinUs({
      name,
      email,
      message
    });

    await newSubmission.save();
    
    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: newSubmission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting form',
      error: error.message
    });
  }
}; 