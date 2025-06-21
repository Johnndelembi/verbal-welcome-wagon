(function() {
  'use strict';

  // Load Lucide icons
  const lucideScript = document.createElement('script');
  lucideScript.src = 'https://cdn.jsdelivr.net/npm/lucide@0.263.0/dist/umd/lucide.min.js';
  lucideScript.onload = () => lucide.createIcons();
  document.head.appendChild(lucideScript);

  // Load marked.js for Markdown parsing
  const markedScript = document.createElement('script');
  markedScript.src = 'https://cdn.jsdelivr.net/npm/marked@4.0.18/lib/marked.umd.min.js';
  document.head.appendChild(markedScript);

  window.ChatBotWidget = function(options) {
    const config = {
      apiUrl: options.apiUrl || 'http://localhost:8000',
      position: options.position || 'bottom-right',
      wa_id: options.wa_id || 'widget-user-' + Date.now(),
      name: options.name || 'Website Visitor'
    };

    // Create widget HTML
    const widgetHTML = `
      <div id="chatbot-container" style="position: fixed; z-index: 9999; ${getPositionStyles(config.position)}">
        <div id="chatbot-button" style="
          width: 64px; 
          height: 64px; 
          border-radius: 50%; 
          background: linear-gradient(135deg, #2563eb, #7c3aed); 
          box-shadow: 0 4px 20px rgba(0,0,0,0.2); 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          transition: all 0.3s ease;
          animation: bounce 2s infinite;
        ">
          <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04 1.05 4.39L2 22l5.61-1.05C9.96 21.64 11.46 22 13 22h7c1.1 0 2-.9 2-2V12c0-5.52-4.48-10-10-10zm0 18c-1.35 0-2.7-.3-3.9-.87L7 20l.87-1.1c-.57-1.2-.87-2.55-.87-3.9 0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
        </div>
        <div id="chatbot-popup" style="
          display: none;
          width: 320px;
          height: 400px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          position: absolute;
          bottom: 80px;
          right: 0;
          overflow: hidden;
          transition: all 0.3s ease;
        ">
          <div id="chatbot-header" style="
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: white;
            padding: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: space-between;
          ">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 8px; height: 8px; background: #34d399; border-radius: 50%; animation: pulse 2s infinite;"></div>
              <span>AI Assistant</span>
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
              <button id="minimize-chat" style="
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 4px;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
              ">
                <i data-lucide="minimize-2" style="width: 16px; height: 16px;"></i>
              </button>
              <button id="close-chat" style="
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 4px;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
              ">
                <i data-lucide="x" style="width: 16px; height: 16px;"></i>
              </button>
            </div>
          </div>
          <div id="chat-messages" style="
            height: 280px;
            overflow-y: auto;
            padding: 16px;
            background: #f3f4f6;
            transition: height 0.3s ease;
          ">
            <div style="
              background: white;
              padding: 12px;
              border-radius: 12px;
              margin-bottom: 8px;
              border-bottom-left-radius: 4px;
              animation: fadeIn 0.5s ease;
            ">
              <p style="font-size: 14px; color: #374151;">Hi! I'm your AI assistant. How can I help you today?</p>
              <p style="font-size: 12px; color: #6b7280; margin-top: 4px;">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          <div style="padding: 16px; border-top: 1px solid #e5e7eb;">
            <div style="display: flex; gap: 8px;">
              <input id="chat-input" type="text" placeholder="Type your message..." style="
                flex: 1;
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 9999px;
                outline: none;
                font-size: 14px;
                transition: border-color 0.2s;
              ">
              <button id="send-button" style="
                background: linear-gradient(135deg, #2563eb, #7c3aed);
                color: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s;
              ">
                <i data-lucide="send" style="width: 16px; height: 16px;"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        #chatbot-button:hover {
          background: linear-gradient(135deg, #1e40af, #6d28d9);
          box-shadow: 0 6px 24px rgba(0,0,0,0.25);
        }
        #chat-input:focus {
          border-color: #2563eb;
        }
        #send-button:hover {
          background: linear-gradient(135deg, #1e40af, #6d28d9);
        }
        #minimize-chat:hover, #close-chat:hover {
          background: rgba(255,255,255,0.2);
        }
        .loading-dots div {
          width: 8px;
          height: 8px;
          background: #6b7280;
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .loading-dots div:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots div:nth-child(2) { animation-delay: -0.16s; }
        /* Markdown styles */
        .chat-message p { margin: 0; }
        .chat-message strong { font-weight: 700; }
        .chat-message em { font-style: italic; }
        .chat-message a { color: #2563eb; text-decoration: underline; }
        .chat-message ul, .chat-message ol { margin: 8px 0; padding-left: 20px; }
        .chat-message li { margin-bottom: 4px; }
        .chat-message code { 
          background: #e5e7eb; 
          padding: 2px 4px; 
          border-radius: 4px; 
          font-family: monospace; 
          font-size: 13px; 
        }
        .chat-message pre { 
          background: #e5e7eb; 
          padding: 8px; 
          border-radius: 4px; 
          overflow-x: auto; 
          font-family: monospace; 
          font-size: 13px; 
        }
      </style>
    `;

    // Insert widget into page
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // Get elements
    const button = document.getElementById('chatbot-button');
    const popup = document.getElementById('chatbot-popup');
    const header = document.getElementById('chatbot-header');
    const messages = document.getElementById('chat-messages');
    const closeBtn = document.getElementById('close-chat');
    const minimizeBtn = document.getElementById('minimize-chat');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-button');

    let isMinimized = false;

    // Event listeners
    button.addEventListener('click', () => {
      popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
      if (popup.style.display === 'block') {
        lucide.createIcons();
      }
    });

    closeBtn.addEventListener('click', () => {
      popup.style.display = 'none';
    });

    minimizeBtn.addEventListener('click', () => {
      isMinimized = !isMinimized;
      messages.style.display = isMinimized ? 'none' : 'block';
      popup.style.height = isMinimized ? '64px' : '400px';
      minimizeBtn.innerHTML = `<i data-lucide="${isMinimized ? 'maximize-2' : 'minimize-2'}" style="width: 16px; height: 16px;"></i>`;
      lucide.createIcons();
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    sendBtn.addEventListener('click', sendMessage);

    function sendMessage() {
      const message = input.value.trim();
      if (!message) return;

      // Add user message
      addMessage(message, true);
      input.value = '';

      // Add loading indicator
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'loading-dots';
      loadingDiv.style.cssText = `
        background: white;
        padding: 12px;
        border-radius: 12px;
        margin-bottom: 8px;
        margin-right: 20px;
        border-bottom-left-radius: 4px;
        animation: fadeIn 0.5s ease;
        display: flex;
        gap: 4px;
      `;
      loadingDiv.innerHTML = `<div></div><div></div><div></div>`;
      messages.appendChild(loadingDiv);
      messages.scrollTop = messages.scrollHeight;

      // Send to API
      fetch(config.apiUrl + '/webhook/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message_body: message,
          wa_id: config.wa_id,
          name: config.name
        })
      })
      .then(response => response.json())
      .then(data => {
        messages.removeChild(loadingDiv);
        addMessage(data.response, false);
      })
      .catch(error => {
        messages.removeChild(loadingDiv);
        addMessage('Sorry, I encountered an error. Please try again.', false);
      });
    }

    function addMessage(text, isUser) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'chat-message';
      messageDiv.style.cssText = `
        background: ${isUser ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : 'white'};
        color: ${isUser ? 'white' : '#374151'};
        padding: 12px;
        border-radius: 12px;
        margin-bottom: 8px;
        ${isUser ? 'margin-left: 20px; border-bottom-right-radius: 4px;' : 'margin-right: 20px; border-bottom-left-radius: 4px;'}
        animation: fadeIn 0.5s ease;
      `;
      // Parse Markdown for bot messages, plain text for user messages
      const parsedText = isUser ? text : window.marked ? window.marked.parse(text) : text;
      messageDiv.innerHTML = `
        <p style="font-size: 14px;">${parsedText}</p>
        <p style="font-size: 12px; ${isUser ? 'color: #bfdbfe;' : 'color: #6b7280;'} margin-top: 4px;">
          ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      `;
      messages.appendChild(messageDiv);
      messages.scrollTop = messages.scrollHeight;
    }

    function getPositionStyles(position) {
      switch (position) {
        case 'bottom-left':
          return 'bottom: 24px; left: 24px;';
        case 'top-right':
          return 'top: 24px; right: 24px;';
        case 'top-left':
          return 'top: 24px; left: 24px;';
        default:
          return 'bottom: 24px; right: 24px;';
      }
    }
  };
})();