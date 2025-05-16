const About = require('../models/about');

exports.updateContent = async (req, res) => {
    try {
        const { content } = req.body;
        
        // Find the about document or create if it doesn't exist
        let about = await About.findOne();
        if (!about) {
            about = new About({ content });
        } else {
            about.content = content;
        }

        await about.save();

        res.status(200).json({
            success: true,
            message: 'About content updated successfully',
            data: about
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating about content',
            error: error.message
        });
    }
}; 