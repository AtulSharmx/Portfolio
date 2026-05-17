/**
 * Chat Routes
 * Handles POST /chat endpoint for AI responses
 */

const express = require('express');
const router = express.Router();
const { sendMessage } = require('../services/geminiService');

/**
 * POST /chat
 * Accepts user message and returns AI response
 */
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    // Validate request
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    if (typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message must be a non-empty string',
      });
    }

    // Limit message length to prevent abuse
    if (message.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Message is too long (max 1000 characters)',
      });
    }

    // Get AI response
    const aiResponse = await sendMessage(message.trim());

    // Return success response
    res.json({
      success: true,
      message: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat route error:', error);

    // Determine error type and respond accordingly
    if (error.message.includes('API key')) {
      return res.status(500).json({
        success: false,
        error: 'API configuration error',
        message: 'Server is not properly configured',
        details: error.message,
      });
    }

    if (error.message.includes('quota')) {
      return res.status(429).json({
        success: false,
        error: 'Rate limited',
        message: 'Too many requests. Please try again later.',
        details: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to process message',
      message: 'Please try again in a moment',
      details: error.message,
    });
  }
});

module.exports = router;
