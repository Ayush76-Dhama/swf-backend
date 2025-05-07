const Contact = require('../models/contact');

exports.submitForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const newSubmission = new Contact({
      name,
      email,
      phone,
      subject,
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


