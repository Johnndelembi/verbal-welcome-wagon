
(function() {
  'use strict';
  
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
          width: 60px; 
          height: 60px; 
          border-radius: 50%; 
          background: linear-gradient(135deg, #3b82f6, #8b5cf6); 
          box-shadow: 0 4px 20px rgba(0,0,0,0.15); 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          transition: all 0.3s ease;
        ">
          <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04 1.05 4.39L2 22l5.61-1.05C9.96 21.64 11.46 22 13 22h7c1.1 0 2-.9 2-2V12c0-5.52-4.48-10-10-10zm0 18c-1.35 0-2.7-.3-3.9-.87L7 20l.87-1.1c-.57-1.2-.87-2.55-.87-3.9 0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
        </div>
        <div id="chatbot-popup" style="
          display: none;
          width: 300px;
          height: 400px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          position: absolute;
          bottom: 70px;
          right: 0;
          overflow: hidden;
        ">
          <div style="
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 16px;
            font-weight: 600;
          ">
            AI Assistant
            <span id="close-chat" style="float: right; cursor: pointer; font-size: 18px;">&times;</span>
          </div>
          <div id="chat-messages" style="
            height: 280px;
            overflow-y: auto;
            padding: 16px;
            background: #f9fafb;
          ">
            <div style="
              background: white;
              padding: 12px;
              border-radius: 12px;
              margin-bottom: 8px;
              border-radius-bottom-left: 4px;
            ">
              Hi! I'm your AI assistant. How can I help you today?
            </div>
          </div>
          <div style="padding: 16px; border-top: 1px solid #e5e7eb;">
            <div style="display: flex; gap: 8px;">
              <input id="chat-input" type="text" placeholder="Type your message..." style="
                flex: 1;
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 20px;
                outline: none;
                font-size: 14px;
              ">
              <button id="send-button" style="
                background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                color: white;
                border: none;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Insert widget into page
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // Get elements
    const button = document.getElementById('chatbot-button');
    const popup = document.getElementById('chatbot-popup');
    const closeBtn = document.getElementById('close-chat');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-button');
    const messages = document.getElementById('chat-messages');

    // Event listeners
    button.addEventListener('click', () => {
      popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
    });

    closeBtn.addEventListener('click', () => {
      popup.style.display = 'none';
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
        addMessage(data.response, false);
      })
      .catch(error => {
        addMessage('Sorry, I encountered an error. Please try again.', false);
      });
    }

    function addMessage(text, isUser) {
      const messageDiv = document.createElement('div');
      messageDiv.style.cssText = `
        background: ${isUser ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'white'};
        color: ${isUser ? 'white' : '#374151'};
        padding: 12px;
        border-radius: 12px;
        margin-bottom: 8px;
        ${isUser ? 'margin-left: 20px; border-bottom-right-radius: 4px;' : 'margin-right: 20px; border-bottom-left-radius: 4px;'}
        word-wrap: break-word;
      `;
      messageDiv.textContent = text;
      messages.appendChild(messageDiv);
      messages.scrollTop = messages.scrollHeight;
    }

    function getPositionStyles(position) {
      switch (position) {
        case 'bottom-left':
          return 'bottom: 20px; left: 20px;';
        case 'top-right':
          return 'top: 20px; right: 20px;';
        case 'top-left':
          return 'top: 20px; left: 20px;';
        default:
          return 'bottom: 20px; right: 20px;';
      }
    }
  };
})();
