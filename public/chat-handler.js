/**
 * Chat Handler for Atul AI
 * Connects the "Know Me More" popup with the backend Gemini API
 */

(function initializeChat() {
  const chatPopup = document.getElementById('kmChatPopup');
  const chatInput = document.getElementById('kmChatInput');
  const chatSendBtn = document.querySelector('.km-chat-send-btn');
  const quickBtns = document.querySelectorAll('.km-chat-quick-btn');
  const chatOverlay = document.getElementById('kmChatOverlay');
  
  // Chat state
  let isLoading = false;
  let messageHistory = [];
  
  const API_BASE_URL = window.PORTFOLIO_AI_API_URL || 'https://atul-portfolio-ai.onrender.com';
  const API_URL = `${API_BASE_URL}/api/chat`;

  /**
   * Add message to chat
   */
  function addMessage(text, isUser = true) {
    const messageEl = document.createElement('article');
    messageEl.className = `km-chat-card ${isUser ? 'user' : 'ai'}`;
    
    if (isUser) {
      messageEl.innerHTML = `<p>${escapeHtml(text)}</p>`;
      messageEl.style.marginLeft = 'auto';
      messageEl.style.backgroundColor = '#e8ff47';
      messageEl.style.color = '#1a1a1a';
      messageEl.style.maxWidth = '80%';
    } else {
      messageEl.innerHTML = `<p>${escapeHtml(text)}</p>`;
    }
    
    // Find chat messages container (before input wrap)
    const inputWrap = document.querySelector('.km-chat-input-wrap');
    chatPopup.insertBefore(messageEl, inputWrap);
    
    // Auto scroll to bottom
    setTimeout(() => {
      chatPopup.scrollTop = chatPopup.scrollHeight;
    }, 50);
  }

  /**
   * Show loading indicator
   */
  function showLoading() {
    const loadingEl = document.createElement('article');
    loadingEl.className = 'km-chat-card ai km-chat-loading';
    loadingEl.id = 'km-loading';
    loadingEl.innerHTML = '<p>Typing... <span class="dots">●●●</span></p>';
    
    const inputWrap = document.querySelector('.km-chat-input-wrap');
    chatPopup.insertBefore(loadingEl, inputWrap);
    
    // Animate dots
    let dotCount = 0;
    const dotInterval = setInterval(() => {
      const dots = document.querySelector('.dots');
      if (dots) {
        dotCount = (dotCount + 1) % 4;
        dots.textContent = '●●●'.substring(0, dotCount + 1).padEnd(3, '○');
      } else {
        clearInterval(dotInterval);
      }
    }, 500);
    
    chatPopup.scrollTop = chatPopup.scrollHeight;
  }

  /**
   * Remove loading indicator
   */
  function removeLoading() {
    const loadingEl = document.getElementById('km-loading');
    if (loadingEl) loadingEl.remove();
  }

  /**
   * Send message to backend
   */
  async function sendMessage(userText) {
    if (!userText.trim() || isLoading) return;

    // Add user message to chat
    addMessage(userText, true);
    chatInput.value = '';
    
    isLoading = true;
    showLoading();

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userText }),
      });

      removeLoading();

      if (!response.ok) {
        const rawBody = await response.text();
        let errorData = {};
        try {
          errorData = rawBody ? JSON.parse(rawBody) : {};
        } catch (_err) {
          errorData = { message: rawBody };
        }

        const serverMsg = errorData.details || errorData.message || errorData.error || 'Unknown server error';
        throw new Error(`HTTP ${response.status}: ${serverMsg}`);
      }

      const data = await response.json();
      
      if (data.success && data.message) {
        addMessage(data.message, false);
        messageHistory.push({ user: userText, ai: data.message });
      } else {
        addMessage('Sorry, I could not generate a response. Please try again.', false);
      }
    } catch (error) {
      removeLoading();
      console.error('Chat error:', error);

      let errorMessage = 'Chat error: ';
      if (error.message.includes('Failed to fetch')) {
        errorMessage += 'Cannot connect to backend at http://localhost:5000.';
      } else {
        errorMessage += error.message;
      }

      addMessage(errorMessage, false);
    } finally {
      isLoading = false;
      chatInput.focus();
    }
  }

  /**
   * Handle send button click
   */
  chatSendBtn?.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) sendMessage(message);
  });

  /**
   * Handle Enter key in input
   */
  chatInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (message) sendMessage(message);
    }
  });

  /**
   * Handle quick question buttons
   */
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.textContent;
      sendMessage(question);
    });
  });

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  // Log chat ready
  console.log('✅ Atul AI Chat initialized:', API_URL);
})();
