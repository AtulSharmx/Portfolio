/**
 * Chat Routes
 * POST /api/chat — accepts user message, returns AI response
 */

const express = require('express');
const router = express.Router();
const { sendMessage } = require('../services/geminiService');

router.post('/', async (req, res) => {
  const isDev = process.env.NODE_ENV !== 'production';

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message must be a non-empty string' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ success: false, error: 'Message too long (max 1000 chars)' });
    }

    const aiResponse = await sendMessage(message.trim());
    res.json({ success: true, message: aiResponse });

  } catch (error) {
    console.error('[chat]', error.message);

    if (error.message.includes('API key') || error.message.includes('not initialized')) {
      return res.status(503).json({
        success: false,
        message: 'AI service temporarily unavailable.',
        ...(isDev && { details: error.message }),
      });
    }

    if (error.message.includes('quota') || error.message.includes('429')) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Please try again in a moment.',
      ...(isDev && { details: error.message }),
    });
  }
});

module.exports = router;
