# Atul Sharma - Brutalist Personal Portfolio

A premium brutalist/minimalist responsive personal portfolio website crafted for frontend development.

## 🎨 Design & Aesthetic
- **Minimalist Neo-Brutalist Layout**: Uses a light cream background (`#F4F1EA`), sharp thick borders, and heavy, bold uppercase black typography.
- **Micro-Animations**: Hover animations on buttons and interactive cards featuring neo-brutalist translation shadows.
- **Embedded AI Chatbot**: Built-in floating chat modal that communicates with the live Gemini AI assistant (with a responsive local mock fallback when offline).

## 📂 Project Structure
This project is kept extremely lightweight and clean:
- `index.html`: Core HTML5 semantic document structure.
- `style.css`: Styles containing neo-brutalist theme tokens, layout rules, font imports, and responsiveness.
- `script.js`: Clean JavaScript driving mobile navigation, chat modal interactions, and the Gemini API fetch wrapper.
- `Atul_Sharma_Resume.pdf`: Direct resume download asset.

## 🚀 Local Run Instructions
1. Open this workspace in a local browser or run a simple HTTP server.
   For example, in Python:
   ```bash
   python -m http.server 8000
   ```
2. Navigate to `http://localhost:8000`.

## 🚢 Deploy to Vercel
This project is ready to deploy cleanly as a static Vercel project:
1. Initialize Git if not done yet:
   ```bash
   git init
   git add .
   git commit -m "feat: init brutalist portfolio"
   ```
2. Run Vercel CLI at the root:
   ```bash
   vercel
   ```
3. Follow prompts to deploy instantly.
