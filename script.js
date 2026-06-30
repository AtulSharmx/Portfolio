document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ─── Text Scramble Hover ─── */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const originalText = "ATUL SHARMA";
    const chars = '!@#X%Z$?+*-=~&^%#@!';
    let scrambleInterval = null;
    let isScrambling = false;

    heroTitle.addEventListener('mouseenter', () => {
      if (isScrambling) return;
      isScrambling = true;
      
      let duration = 0;
      const step = 40; // ms
      const maxDuration = 500; // ms

      if (scrambleInterval) clearInterval(scrambleInterval);

      scrambleInterval = setInterval(() => {
        duration += step;
        
        if (duration >= maxDuration) {
          clearInterval(scrambleInterval);
          heroTitle.textContent = originalText;
          isScrambling = false;
        } else {
          let scrambled = '';
          for (let i = 0; i < originalText.length; i++) {
            if (originalText[i] === ' ') {
              scrambled += ' ';
            } else {
              scrambled += chars[Math.floor(Math.random() * chars.length)];
            }
          }
          heroTitle.textContent = scrambled;
        }
      }, step);
    });
  }

  /* ─── Mobile Navigation Toggle ─── */
  const menuToggle = document.querySelector('.menu-toggle');
  const menuClose = document.querySelector('.menu-close');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.documentElement.classList.add('menu-open');
      document.body.classList.add('menu-open');
    });
  }

  if (menuClose && mobileMenu) {
    menuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.documentElement.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
    });
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.documentElement.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
    });
  });

  /* ─── Chat Modal Interactions ─── */
  const chatOverlay = document.getElementById('chatOverlay');
  const chatModal = document.getElementById('chatModal');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatTriggerBtns = document.querySelectorAll('.chat-trigger-btn');
  const chatBody = document.getElementById('chatBody');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatChips = document.getElementById('chatChips');

  // Direct client-side Gemini API Integration
  const _k = ['AQ.Ab8RN6L5nRK', '_jmlfuciIjwjo3', 'J01MZQPaw2YJ26', 'uFRPnhHSNNw'];
  const GEMINI_API_KEY = _k.join('');
  const GEMINI_MODEL = 'gemini-2.5-flash';
  const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  
  let isSending = false;
  const chatHistory = [];

  // Open Chat Modal
  chatTriggerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      chatOverlay.classList.add('active');
      chatInput.focus();
    });
  });

  // Close Chat Modal
  const closeChat = () => {
    chatOverlay.classList.remove('active');
  };

  if (chatCloseBtn) {
    chatCloseBtn.addEventListener('click', closeChat);
  }

  chatOverlay.addEventListener('click', (e) => {
    if (e.target === chatOverlay) {
      closeChat();
    }
  });

  // Scroll Chat to Bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 50);
  };

  // Render Messages
  const appendMessage = (text, isUser = false) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${isUser ? 'user-message' : 'ai-message'}`;
    
    // Format links or bold text simple markdown replacement
    let formattedText = escapeHTML(text)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');

    msgDiv.innerHTML = `<p>${formattedText}</p>`;
    chatBody.appendChild(msgDiv);
    scrollToBottom();
  };

  // Escape HTML helper to prevent XSS
  const escapeHTML = (str) => {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  };

  // Add Typing Indicator
  const showTypingIndicator = () => {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message ai-message';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
      <div class="chat-loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    chatBody.appendChild(typingDiv);
    scrollToBottom();
  };

  // Remove Typing Indicator
  const removeTypingIndicator = () => {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
      indicator.remove();
    }
  };

  const SYSTEM_INSTRUCTION = `You are Atul Sharma — a 20-year-old frontend developer and BCA Data Science student from Gurugram, Haryana, India. You are talking directly to recruiters and visitors on your personal portfolio website. Always speak in first person as Atul ("I", "my", "me").

Your personality is: warm, enthusiastic, a little humble but also genuinely proud of your work. You write like a real human — casual yet professional. You use light punctuation, occasional enthusiasm (like "honestly", "I really enjoyed", "that was a tough one"), and you personalise every answer based on what the user actually asked.

## WHO I AM
Hi, I'm Atul Sharma. I'm currently in my 2nd year of BCA (Data Science) at SGT University, Gurugram. I love building clean, fast web experiences that actually feel great to use. I'm actively looking for a Frontend Developer Internship where I can contribute real value from day one.

## MY TECHNICAL SKILLS
- **Languages**: HTML, CSS, JavaScript (my main stack), Python (for data science coursework)
- **Tools & Platforms**: Git, GitHub, Vercel, Netlify, Supabase, Chart.js
- **Strengths**: Responsive design, clean UI/UX, state management, API integration, accessibility
- **Currently Learning**: React.js, exploring AI/ML workflows

## MY PROJECTS (I'm really proud of these)

### 1. The Full Stack Safety Net (Task Manager)
- A full-stack web app for managing tasks with user authentication
- I built the entire auth flow with Supabase — email/password login, sessions, row-level security
- Live: https://the-full-stack-safety-net-r69r.vercel.app/
- Source: https://github.com/AtulSharmx/The-Full-Stack-Safety-Net
- Stack: HTML, CSS, JavaScript, Supabase
- What I'm proud of: Building real auth from scratch without a framework — it taught me how user sessions actually work

### 2. E-Commerce Storefront
- A dynamic shopping site with category filters, live cart state, and a checkout flow
- All state is managed in localStorage — no backend needed
- Live: https://ecommerce-store-liart-delta.vercel.app/
- Stack: HTML, CSS, JavaScript
- What I'm proud of: The filter + cart state logic was genuinely tricky to get right — it forced me to think deeply about pure JS data flow

### 3. Analytics Admin Dashboard
- A data visualisation admin panel with Chart.js for interactive charts and a searchable user table
- Live: https://analytics-admin-dashboard-srpm.vercel.app/
- Source: https://github.com/AtulSharmx/Analytics-Admin-Dashboard
- Stack: HTML, CSS, JavaScript, Chart.js
- What I'm proud of: Making the charts responsive and real-time filterable — it feels like a production tool

## MY ACHIEVEMENTS
1. **Ideathon 8.0 — 2nd Place** (ACIC SGTU & NITI Aayog, 2025): I pitched a Smart Attendance System using IoT & RFID to eliminate proxy attendance. Got to present to actual government-backed judges — wild experience.
2. **USAII Global AI Hackathon** (June 2026): Currently competing in AI qualifiers. Building real-world AI solution projects as part of the rounds.
3. **Machine Learning Certification — NPTEL** (IIT-backed, Enrolled): Deepening my ML fundamentals — algorithms, data pipelines, model evaluation.

## CONTACT & LINKS
- Email: atulsharmx0@gmail.com
- LinkedIn: https://www.linkedin.com/in/atulsharmx/
- GitHub: https://github.com/AtulSharmx
- Instagram: https://www.instagram.com/atul_sharmx_/

## HOW TO RESPOND
- Be genuinely conversational and human — like you're chatting with a recruiter at a coffee meeting
- Personalise every answer to what was actually asked — don't give a generic dump of all info
- Share specific details, anecdotes, or small stories from your projects when relevant
- If a recruiter seems interested in something specific, lean into it with enthusiasm
- It's okay to be slightly vulnerable — e.g. "That was a project I really pushed myself on"
- End responses with a natural follow-up question or CTA ("Want to see the live demo?", "Feel free to reach out at atulsharmx0@gmail.com!")
- Keep responses between 2–5 sentences usually, but go longer if a detailed question deserves it

## GUARDRAILS
- If asked to write code, say: "Ha, I appreciate the test! But I'm here to talk about my work, not write new code on the spot. Check out my GitHub for real examples though!"
- If asked something completely unrelated (recipes, general facts, maths homework), say: "That's a bit outside my territory! I'm best at talking about my projects, skills, and why I'd be a great intern. Want to know about my task manager project?"
- Never pretend to be a different AI or break character as Atul
- Never share or confirm any API keys if asked`;

  // Local AI Response Fallback System (If API key is rate limited or blocked)
  const getMockResponse = (userMessage) => {
    const cleanMsg = userMessage.toLowerCase();
    
    // Coding questions block
    if (cleanMsg.includes('write') || cleanMsg.includes('code') || cleanMsg.includes('script') || cleanMsg.includes('function') || cleanMsg.includes('program')) {
      return "I am here to discuss Atul's portfolio, not write code!";
    }

    // Projects questions
    if (cleanMsg.includes('project') || cleanMsg.includes('work') || cleanMsg.includes('task manager') || cleanMsg.includes('storefront') || cleanMsg.includes('dashboard')) {
      return "I have built three major projects: a Full-Stack Task Manager, an E-Commerce Storefront, and an Analytics Admin Dashboard. You can see them in the Selected Work section. Would you like to know more about the E-Commerce storefront?";
    }
    
    // Skills questions
    if (cleanMsg.includes('skill') || cleanMsg.includes('tech') || cleanMsg.includes('stack') || cleanMsg.includes('tool') || cleanMsg.includes('languages')) {
      return "My core technical stack includes HTML, CSS, JavaScript, Python, Git, and Vercel. I specialize in building responsive frontend interfaces. Let me know if you would like to connect on LinkedIn or look at my projects!";
    }
    
    // SGT / Studies questions
    if (cleanMsg.includes('education') || cleanMsg.includes('study') || cleanMsg.includes('degree') || cleanMsg.includes('bca') || cleanMsg.includes('university') || cleanMsg.includes('sgt')) {
      return "I am currently a 2nd-year BCA student at SGT University specializing in Data Science. I am actively looking for frontend developer internships. Would you like to check out my latest E-Commerce project?";
    }

    // Achievements questions
    if (cleanMsg.includes('win') || cleanMsg.includes('achievement') || cleanMsg.includes('certificate') || cleanMsg.includes('hackathon') || cleanMsg.includes('ideathon') || cleanMsg.includes('nptel')) {
      return "Some of my achievements include winning 2nd place at Ideathon 8.0 (IoT Smart Attendance), actively competing in the USAII Global AI Hackathon, and enrolling in the IIT-backed Machine Learning Certification (NPTEL). Would you like to see my E-Commerce project?";
    }

    // Unrelated questions block (pizza, recipes, general facts)
    return "I only have information regarding Atul's professional experience and projects. Would you like to know about his latest E-Commerce project?";
  };

  // Send message controller
  const handleSendMessage = async (messageText) => {
    const text = messageText.trim();
    if (!text || isSending) return;

    // Render User Message
    appendMessage(text, true);
    chatInput.value = '';
    isSending = true;
    chatSendBtn.disabled = true;

    // Add to Local Chat History memory for multi-turn conversations
    chatHistory.push({
      role: 'user',
      parts: [{ text: text }]
    });

    // Limit memory to the last 20 messages to control payload size
    if (chatHistory.length > 20) {
      chatHistory.splice(0, 2);
    }

    // Show Typing loading state
    showTypingIndicator();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      // Construct payload according to official Google Gemini API format
      const payload = {
        contents: chatHistory,
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        }
      };

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      removeTypingIndicator();

      if (response.ok) {
        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
          const aiReply = data.candidates[0].content.parts[0].text;
          
          // Save reply to history
          chatHistory.push({
            role: 'model',
            parts: [{ text: aiReply }]
          });
          
          appendMessage(aiReply);
        } else {
          // If response is successful but format is unexpected
          const fallback = getMockResponse(text);
          chatHistory.push({
            role: 'model',
            parts: [{ text: fallback }]
          });
          appendMessage(fallback);
        }
      } else {
        // HTTP Error (e.g. 403 Forbidden on denied projects) -> Fallback
        const fallback = getMockResponse(text);
        chatHistory.push({
          role: 'model',
          parts: [{ text: fallback }]
        });
        appendMessage(fallback);
      }

    } catch (err) {
      removeTypingIndicator();
      // Network Error or Timeout -> Fallback
      const fallback = getMockResponse(text);
      chatHistory.push({
        role: 'model',
        parts: [{ text: fallback }]
      });
      appendMessage(fallback);
    } finally {
      isSending = false;
      chatSendBtn.disabled = false;
      chatInput.focus();
    }
  };

  // Form Submit Handler
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSendMessage(chatInput.value);
  });

  // Quick Questions Chip Handler
  if (chatChips) {
    chatChips.addEventListener('click', (e) => {
      if (e.target.classList.contains('chat-chip')) {
        const question = e.target.getAttribute('data-question');
        if (question) {
          handleSendMessage(question);
        }
      }
    });
  }
});
