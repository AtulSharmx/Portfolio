/**
 * Atul AI Backend
 * Express server with Gemini API integration
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { initializeGemini } = require('./server/services/geminiService');
const chatRoutes = require('./server/routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;
const isDevelopment = process.env.NODE_ENV !== 'production';
const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);

// ============ MIDDLEWARE ============
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : null;

app.use(cors({
  origin: ALLOWED_ORIGINS || true, // restrict via env var in production
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
}));
app.options('*', cors());
app.use(express.json({ limit: '50kb' })); // chat messages are tiny
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: isDevelopment ? 0 : '1d', // cache static assets in production
}));

// ============ INITIALIZE GEMINI ============
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️  GEMINI_API_KEY is not set in .env file');
  } else {
    initializeGemini(apiKey);
    console.log('✅ Gemini API initialized');
  }
} catch (error) {
  console.error('❌ Failed to initialize Gemini API:', error.message);
}

// ============ ROUTES ============

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Atul AI backend is running',
    geminiConfigured: hasGeminiKey,
    timestamp: new Date().toISOString(),
  });
});

// Chat endpoint
app.use('/api/chat', chatRoutes);

// Serve index.html for any unknown routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============ ERROR HANDLING ============
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
    message: isDevelopment ? err.message : 'Internal server error',
    details: isDevelopment ? String(err.stack || err) : undefined,
  });
});

// ============ START SERVER ============
app.listen(PORT, () => {
  console.log(`[server] Running on port ${PORT} (${isDevelopment ? 'development' : 'production'})`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});
