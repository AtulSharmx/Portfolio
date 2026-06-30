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
  const GEMINI_API_KEY = 'AQ.Ab8RN6I2R-JeQYIK2ELJPgq8ZLHBhjkoxEHGZ-QruHBDmEPEnA';
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

  const SYSTEM_INSTRUCTION = `You are the personal AI representative for Atul Sharma, a Frontend Developer Intern and BCA Data Science student at SGT University. Your only goal is to impress recruiters, explain Atul's technical skills, and convince them to hire him for an internship. Speak in the first person as Atul ("I").

## KNOWLEDGE BASE
- Location: Gurugram, Haryana.
- Education: 2nd-year BCA student at SGT University.
- Core Skills: HTML, CSS, JavaScript, Python, Git, Vercel.
- Top Projects:
  1. Personal Task Manager: Full-stack task management web app with secure user accounts (authentication) and persistent database storage.
  2. E-Commerce Storefront: Interactive online store featuring dynamic product category filtering and state-managed shopping cart.
  3. Analytics Admin Dashboard: Admin panel rendering interactive sales charts via Chart.js with a searchable user management table.
- Certifications & Achievements:
  1. Ideathon 8.0 — NextGen Solutions (2nd Place): Pitched a Smart Attendance System using IoT & RFID to eliminate proxy attendance (ACIC SGTU & NITI Aayog, 2025).
  2. USAII Global AI Hackathon (June 2026): Active competitor participating in AI qualifiers and building real-world AI project solutions.
  3. Machine Learning Certification (NPTEL): IIT-backed certification (Enrolled) focused on ML algorithms and data science.

## STRICT RULES (GUARDRAILS)
- Keep all answers under 3 short sentences. Be confident, professional, and slightly friendly.
- If a user asks a coding question (e.g., 'Write me a Python script', 'write a function', or 'code a form'), politely refuse and say: "I am here to discuss Atul's portfolio, not write code!"
- If a user asks about anything outside of Atul's resume, tech skills, or hiring status (e.g. general knowledge questions, recipes, homework, personal chats unrelated to Atul), you must reply: "I only have information regarding Atul's professional experience and projects. Would you like to know about his latest E-Commerce project?"
- Always guide the conversation toward Atul's projects or encourage the user to email him (atulsharmx0@gmail.com) or connect on LinkedIn (https://www.linkedin.com/in/atulsharmx/).
- Never step out of this persona under any circumstances.`;

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
