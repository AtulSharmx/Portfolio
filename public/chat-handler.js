/**
 * Chat Handler — Atul AI
 * Connects the chat popup with the Gemini backend
 */

(function initializeChat() {
  const chatPopup   = document.getElementById('kmChatPopup');
  const chatInput   = document.getElementById('kmChatInput');
  const chatSendBtn = document.querySelector('.km-chat-send-btn');
  const quickBtns   = document.querySelectorAll('.km-chat-quick-btn');
  const chatOverlay = document.getElementById('kmChatOverlay');

  if (!chatPopup || !chatInput || !chatSendBtn) return;

  const API_BASE = window.PORTFOLIO_AI_API_URL || 'https://atul-portfolio-ai.onrender.com';
  const API_URL  = `${API_BASE}/api/chat`;

  let isLoading = false;
  const MAX_HISTORY = 20; // cap memory usage
  const messageHistory = [];

  // ── Helpers ──────────────────────────────────────────────

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, (m) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m])
    );
  }

  function addMessage(text, isUser = true) {
    const el = document.createElement('article');
    el.className = `km-chat-card ${isUser ? 'user' : 'ai'}`;
    el.innerHTML = `<p>${escapeHtml(text)}</p>`;

    if (isUser) {
      el.style.cssText = 'margin-left:auto;background:#e8ff47;color:#1a1a1a;max-width:80%';
    }

    const inputWrap = chatPopup.querySelector('.km-chat-input-wrap');
    chatPopup.insertBefore(el, inputWrap);
    setTimeout(() => { chatPopup.scrollTop = chatPopup.scrollHeight; }, 50);
  }

  function showLoading() {
    const el = document.createElement('article');
    el.className = 'km-chat-card ai km-chat-loading';
    el.id = 'km-loading';
    el.innerHTML = '<p>Typing <span class="dots" aria-live="polite">●●●</span></p>';

    const inputWrap = chatPopup.querySelector('.km-chat-input-wrap');
    chatPopup.insertBefore(el, inputWrap);
    chatPopup.scrollTop = chatPopup.scrollHeight;

    let dotCount = 0;
    const dotSym = ['○○○', '●○○', '●●○', '●●●'];
    const interval = setInterval(() => {
      const dots = document.querySelector('#km-loading .dots');
      if (dots) {
        dotCount = (dotCount + 1) % 4;
        dots.textContent = dotSym[dotCount];
      } else {
        clearInterval(interval);
      }
    }, 400);

    // Store interval on element so removeLoading can clear it safely
    el._dotInterval = interval;
  }

  function removeLoading() {
    const el = document.getElementById('km-loading');
    if (!el) return;
    if (el._dotInterval) clearInterval(el._dotInterval);
    el.remove();
  }

  // ── Core send logic ───────────────────────────────────────

  async function sendMessage(userText) {
    const text = userText.trim();
    if (!text || isLoading) return;

    addMessage(text, true);
    chatInput.value = '';
    isLoading = true;
    chatSendBtn.disabled = true;
    showLoading();

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
        signal: AbortSignal.timeout(20000), // 20 s timeout
      });

      removeLoading();

      if (!res.ok) {
        let errMsg = `Error ${res.status}`;
        try {
          const data = await res.json();
          errMsg = data.message || data.error || errMsg;
        } catch (_) { /* ignore parse errors */ }
        throw new Error(errMsg);
      }

      const data = await res.json();

      if (data.success && data.message) {
        addMessage(data.message, false);
        messageHistory.push({ user: text, ai: data.message });
        // Prevent unbounded memory growth
        if (messageHistory.length > MAX_HISTORY) messageHistory.shift();
      } else {
        addMessage("Sorry, I couldn't generate a response. Try again?", false);
      }
    } catch (err) {
      removeLoading();

      let msg = 'Something went wrong. Please try again.';
      if (err.name === 'TimeoutError') msg = 'Response timed out. Please try again.';
      else if (err.message.includes('Failed to fetch')) msg = 'Cannot reach the server. Check your connection.';
      else if (err.message) msg = err.message;

      addMessage(msg, false);
    } finally {
      isLoading = false;
      chatSendBtn.disabled = false;
      chatInput.focus();
    }
  }

  // ── Event listeners ───────────────────────────────────────

  chatSendBtn.addEventListener('click', () => sendMessage(chatInput.value));

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(chatInput.value);
    }
  });

  quickBtns.forEach((btn) => {
    btn.addEventListener('click', () => sendMessage(btn.textContent.replace(/^[^\w]+/, '').trim()));
  });
})();
