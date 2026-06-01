# 🚀 Atul AI - Quick Start Guide

Your AI-powered portfolio chatbot is ready! Follow these steps to get it running.

## 1️⃣ Install Dependencies

```bash
cd portfolio-ai
npm install
```

This installs Express, Gemini API client, CORS, dotenv, and nodemon.

## 2️⃣ Setup Gemini API Key

Your API key is already in `.env`:
```
GEMINI_API_KEY=your_api_key_here
```

✅ This is already configured and ready to use!

## 3️⃣ Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║        🤖 Atul AI Backend Running      ║
╠════════════════════════════════════════╣
║ 🚀 Server: http://localhost:5000       ║
║ 📝 Chat:   POST /api/chat              ║
║ ✅ Health: GET /health                 ║
╚════════════════════════════════════════╝
```

## 4️⃣ Test the Chatbot

Open your portfolio in browser and click "Know Me More" button:
- Chat popup should appear
- Click quick question buttons or type your own
- AI responds naturally as "Atul AI"
- Messages display in real-time

## 📁 What's Been Set Up

### Backend Files
✅ `server.js` - Main Express app  
✅ `server/routes/chat.js` - Chat API endpoint  
✅ `server/services/geminiService.js` - Gemini integration  
✅ `server/data/knowledge.js` - AI personality & knowledge  
✅ `server/data/portfolioData.json` - Portfolio information  

### Frontend Files  
✅ `public/chat-handler.js` - Chat integration  
✅ `public/index.html` - Updated with chat-handler script  
✅ `public/style.css` - Chat UI styling included  

### Config Files
✅ `.env` - Environment variables (API key configured)  
✅ `.env.example` - Template for deployment  
✅ `.gitignore` - Protects sensitive files  
✅ `package.json` - Dependencies configured  
✅ `README.md` - Full documentation  

## 🎯 How It Works

1. **User sends message** from chat popup
2. **Frontend** sends to `POST /api/chat` endpoint
3. **Backend** injects knowledge base with message
4. **Gemini AI** generates response based on Atul's personality
5. **Response** displayed naturally in chat

## 🔒 Security Notes

✅ API key stored safely in `.env` (not exposed to frontend)  
✅ No API key visible in browser console  
✅ CORS properly configured  
✅ Input validation & length limits  

## 🚢 Deployment

### On Vercel (Easiest)
```bash
npm install -g vercel
vercel
```

### On Render
1. Connect GitHub repo
2. Create Web Service
3. Add environment variable: `GEMINI_API_KEY`
4. Deploy

### On Your Server
1. `npm install`
2. Set `.env` variables
3. `npm start`
4. Use PM2: `pm2 start server.js`

## ✅ Verification Checklist

- [ ] `npm install` completed without errors
- [ ] `.env` file has `GEMINI_API_KEY`
- [ ] `npm run dev` or `npm start` shows server running
- [ ] GET http://localhost:5000/health returns `{"status":"ok"...}`
- [ ] Chat popup opens when clicking "Know Me More"
- [ ] Can send messages and get responses
- [ ] Messages display with loading state
- [ ] No API key appears in browser console

## 🐛 Quick Troubleshooting

**Port already in use:**
```bash
PORT=3000 npm start
```

**Chat not responding:**
- Check backend is running
- Check browser console for errors
- Verify API key in `.env`

**Build fails:**
```bash
rm -rf node_modules
npm install
npm start
```

## 📞 Next Steps

1. **Test locally** - Make sure everything works
2. **Deploy** - Use Vercel or Render
3. **Share** - Add to portfolio description
4. **Monitor** - Check API usage & errors

---

**Status:** ✅ Ready to deploy!  
**Server Files:** All organized in `server/` folder  
**Frontend:** Integrated via `chat-handler.js`  
**Database:** Knowledge base in `server/data/`  

Your AI chatbot is production-ready! 🎉
