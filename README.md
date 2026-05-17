# Atul AI Portfolio Backend

A Node.js Express backend powered by Google's Gemini API, integrated with a portfolio website's "Know Me More" chatbot feature.

## 🚀 Project Structure

```
portfolio-ai/
├── public/                    # Frontend files
│   ├── index.html            # Main portfolio page
│   ├── style.css             # Styles (includes chat UI)
│   ├── script.js             # Portfolio interactions
│   ├── chat-handler.js       # Chat integration
│   └── Atul_Sharma_Resume.pdf
│
├── server/                   # Backend implementation
│   ├── routes/
│   │   └── chat.js          # POST /api/chat endpoint
│   ├── services/
│   │   └── geminiService.js # Gemini API wrapper
│   └── data/
│       ├── knowledge.js     # AI personality & context
│       └── portfolioData.json # Structured portfolio info
│
├── server.js                 # Main Express app
├── package.json              # Dependencies
├── .env                      # Environment variables (not in git)
├── .env.example              # Template for .env
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## ⚙️ Setup

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `@google/generative-ai` - Gemini API client
- `nodemon` - Dev server auto-reload

### 2. Configure Gemini API

1. Get your API key from: https://makersuite.google.com/app/apikey
2. Copy `.env.example` to `.env`
3. Add your API key:

```
GEMINI_API_KEY=your_api_key_here
PORT=5000
NODE_ENV=development
```

⚠️ **IMPORTANT**: Never commit `.env` to git. It's in `.gitignore`.

### 3. Start the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Chat
```
POST /api/chat
Content-Type: application/json

{
  "message": "What projects have you built?"
}
```

**Response:**
```json
{
  "success": true,
  "message": "I've built Age Calculator, Pomodoro Timer, and this portfolio...",
  "timestamp": "2026-05-17T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Message is required"
}
```

## 🤖 AI Configuration

### Knowledge Base
The AI uses information from `server/data/knowledge.js`:

- **Personality**: Friendly, concise, natural tone
- **Context**: Portfolio info, projects, skills, education
- **Behavior**: Acts like Atul, not a generic chatbot

### How It Works

1. User sends message from chat popup
2. `chat-handler.js` sends POST to `/api/chat`
3. Backend calls `geminiService.js`
4. Gemini API processes with injected knowledge base
5. Response returned to frontend as JSON
6. Chat UI displays message

## 🔒 Security

✅ **Protected:**
- API key stored in `.env` (not exposed to frontend)
- CORS enabled for specific origins
- Request validation & sanitization
- Message length limits

❌ **Not Protected (Todo for production):**
- Rate limiting
- Request authentication
- HTTPS enforcement
- Input rate limiting per IP

## 💻 Frontend Integration

The chat is automatically integrated via `public/chat-handler.js`:

```javascript
// Connects to the existing "Know Me More" popup
// Sends messages to POST /api/chat
// Displays responses naturally
// Handles errors gracefully
```

**HTML Integration:**
- Popup: `id="kmChatPopup"`
- Input: `id="kmChatInput"`
- Send Button: `.km-chat-send-btn`
- Quick Buttons: `.km-chat-quick-btn`

All styling is in `public/style.css` - designed to match portfolio aesthetic.

## 🚢 Deployment

### Vercel (Recommended)
```bash
vercel
```

Vercel automatically:
- Detects Node.js backend
- Runs `npm install` & `npm start`
- Sets environment variables
- Handles CORS

### Render
1. Connect GitHub repo
2. Create new Web Service
3. Set environment variables in dashboard
4. Deploy

### Manual Server
1. Install Node.js
2. Clone repo
3. `npm install`
4. Set `.env` variables
5. `npm start`
6. Use PM2 or similar for process management

## 🐛 Troubleshooting

**Server won't start**
```bash
# Check if port 5000 is in use
netstat -an | grep 5000

# Try different port
PORT=3000 npm start
```

**Chat not responding**
```
1. Check .env has GEMINI_API_KEY
2. Check API key is valid
3. Check backend is running (GET /health)
4. Check browser console for errors
5. Check server logs
```

**CORS errors**
- Make sure frontend URL matches CORS config
- Check both server and browser console

**API rate limit**
- Gemini free tier has limits
- Implement request throttling
- Contact Google for higher quota

## 📝 Environment Variables

```
GEMINI_API_KEY      # Google Gemini API key (required)
PORT                # Server port (default: 5000)
NODE_ENV            # Environment (development/production)
```

## 🎯 Features

✅ Real-time AI responses
✅ Knowledge base injection
✅ Error handling
✅ Loading states
✅ Message history
✅ Responsive design
✅ Secure API design

## 🔄 Development

### Project Organization
- Clean separation of concerns
- Modular route & service structure
- Reusable utility functions
- Well-commented code

### Best Practices Used
- Environment-based configuration
- Proper error handling
- Input validation
- Graceful degradation
- CORS security

### Code Quality
- No external complexity
- Beginner-friendly code
- Clear naming conventions
- Console logging for debugging

## 📚 References

- [Express.js Docs](https://expressjs.com)
- [Gemini API Docs](https://ai.google.dev)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/nodejs-web-app)

## 📄 License

MIT

---

**Created by:** Atul Sharma  
**Built with:** Node.js, Express, Gemini API, ❤️
