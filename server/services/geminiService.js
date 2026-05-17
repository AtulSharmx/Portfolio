/**
 * Gemini AI Service
 * Handles all communication with Google's Gemini API
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const knowledge = require('../data/knowledge');

let genAI;
let model;
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

/**
 * Initialize Gemini API with API key
 */
function initializeGemini(apiKey) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is required');
  }
  
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ 
    model: DEFAULT_MODEL,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 256,
    },
  });
}

/**
 * Create system prompt with knowledge base
 */
function createSystemPrompt() {
  return `${knowledge}

Current Context:
- You are in a chat interface on Atul's portfolio website
- User wants to know more about Atul
- Keep responses concise and friendly
- Use portfolio context to answer

Instructions:
- Stay in character
- Keep answers 1-2 sentences typically
- Be helpful and conversational`;
}

/**
 * Send message to Gemini and get response
 * @param {string} userMessage - User's message
 * @returns {Promise<string>} - AI response
 */
async function sendMessage(userMessage) {
  try {
    if (!model) {
      throw new Error('Gemini model not initialized. Call initializeGemini first.');
    }

    if (!userMessage || userMessage.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    // Create chat session with system context
    const chat = model.startChat({
      history: [],
    });

    // Combine system prompt with user message
    const fullPrompt = `${createSystemPrompt()}\n\nUser: ${userMessage}`;

    // Send message and get response
    const result = await chat.sendMessage(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Gemini Service Error:', error);
    throw new Error(`AI service error: ${error.message}`);
  }
}

module.exports = {
  initializeGemini,
  sendMessage,
};
