// AI Chat App with OpenAI Integration and Function Calling
class AIChatApp {
    constructor() {
        this.windowId = 'ai-chat';
        this.chatHistory = storage.get('aiChatHistory', []);
        this.isTyping = false;
        // Use serverless API endpoint (API key is stored securely on server)
        this.apiUrl = '/api/chat';
    }

    open() {
        const content = this.render();
        const window = windowManager.createWindow(this.windowId, {
            title: 'AI Assistant',
            width: 600,
            height: 700,
            class: 'app-ai-chat',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
            </svg>`,
            content: content
        });

        this.attachEvents(window);
        this.loadHistory(window);
    }

    render() {
        const hasHistory = this.chatHistory.length > 0;
        return `
            <div class="chat-container">
                <div class="chat-messages" id="chat-messages">
                    ${hasHistory ? this.chatHistory.map(msg => this.renderMessage(msg)).join('') : ''}
                </div>
                ${!hasHistory ? this.renderWelcomeScreen() : ''}
                <div class="chat-input-container">
                    <textarea class="chat-input" id="chat-input" placeholder="Message AegisDesk AI..." rows="1"></textarea>
                    <button class="chat-send" id="chat-send">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polyline points="22 2 15 22 11 13 2 9 22 2"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    renderWelcomeScreen() {
        return `
            <div class="chat-welcome-screen" id="chat-welcome-screen">
                <div class="welcome-content">
                    <div class="welcome-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                            <path d="M2 17l10 5 10-5"></path>
                            <path d="M2 12l10 5 10-5"></path>
                        </svg>
                    </div>
                    <h1 class="welcome-title">Hi, this is your Aegis Desk</h1>
                    <p class="welcome-subtitle">What can I do for you?</p>
                    
                    <div class="welcome-suggestions">
                        <div class="suggestion-card" data-suggestion="Open the tasks app">
                            <div class="suggestion-icon">✅</div>
                            <div class="suggestion-text">
                                <div class="suggestion-title">Open Apps</div>
                                <div class="suggestion-desc">Launch any application</div>
                            </div>
                        </div>
                        <div class="suggestion-card" data-suggestion="Create a task to buy groceries">
                            <div class="suggestion-icon">📝</div>
                            <div class="suggestion-text">
                                <div class="suggestion-title">Create Tasks</div>
                                <div class="suggestion-desc">Manage your to-do list</div>
                            </div>
                        </div>
                        <div class="suggestion-card" data-suggestion="What can you help me with?">
                            <div class="suggestion-icon">💡</div>
                            <div class="suggestion-text">
                                <div class="suggestion-title">Get Answers</div>
                                <div class="suggestion-desc">Ask me anything</div>
                            </div>
                        </div>
                        <div class="suggestion-card" data-suggestion="Show me the weather">
                            <div class="suggestion-icon">🌤️</div>
                            <div class="suggestion-text">
                                <div class="suggestion-title">Check Weather</div>
                                <div class="suggestion-desc">View weather forecasts</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderWelcome() {
        // Legacy function kept for compatibility - not used anymore
        return '';
    }

    renderMessage(message) {
        return `
            <div class="chat-message ${message.role}">
                <div class="chat-avatar">
                    ${message.role === 'user' 
                        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
                        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>'
                    }
                </div>
                <div class="chat-content">
                    ${this.formatMessage(message.content)}
                </div>
            </div>
        `;
    }

    formatMessage(text) {
        // Simple markdown-like formatting
        return this.escapeHtml(text)
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/`(.+?)`/g, '<code style="background: rgba(99, 102, 241, 0.2); padding: 2px 6px; border-radius: 4px; font-family: monospace;">$1</code>')
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: #19c37d; text-decoration: underline;">$1</a>');
    }

    attachEvents(window) {
        const content = window.querySelector('.window-content');
        const messagesContainer = content.querySelector('#chat-messages');
        const input = content.querySelector('#chat-input');
        const sendBtn = content.querySelector('#chat-send');

        // Auto-resize textarea
        input.addEventListener('input', () => {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 120) + 'px';
        });

        // Send message
        const sendMessage = async () => {
            const text = input.value.trim();
            if (!text || this.isTyping) return;

            // Hide welcome screen if visible
            const welcomeScreen = content.querySelector('#chat-welcome-screen');
            if (welcomeScreen) {
                welcomeScreen.style.opacity = '0';
                welcomeScreen.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    welcomeScreen.style.display = 'none';
                }, 300);
            }

            // Add user message
            const userMessage = { role: 'user', content: text, timestamp: Date.now() };
            this.chatHistory.push(userMessage);
            this.addMessage(userMessage, messagesContainer);
            input.value = '';
            input.style.height = 'auto';
            
            // Show typing indicator
            this.showTyping(messagesContainer);
            sendBtn.disabled = true;

            // Check for function calls first
            const functionCall = this.detectFunctionCall(text);
            
            // Get AI response
            try {
                let aiResponse;
                if (functionCall) {
                    // Handle function call immediately
                    await this.handleFunctionCall(functionCall, messagesContainer);
                    // Get a response after executing the function
                    try {
                        aiResponse = await this.getAIResponse(text);
                    } catch (err) {
                        // If API fails after function call, provide a default response
                        if (functionCall.name === 'open_app') {
                            aiResponse = `I've opened the ${functionCall.appId} app for you!`;
                        } else if (functionCall.name === 'create_task') {
                            aiResponse = `I've created a task: "${functionCall.taskText}". Check your Tasks app!`;
                        } else {
                            aiResponse = 'Done!';
                        }
                    }
                } else {
                    // Normal response
                    aiResponse = await this.getAIResponse(text);
                }
                
                this.hideTyping(messagesContainer);
                
                // Add AI message
                const aiMessage = { 
                    role: 'assistant', 
                    content: aiResponse, 
                    timestamp: Date.now() 
                };
                this.chatHistory.push(aiMessage);
                this.addMessage(aiMessage, messagesContainer);
                this.saveHistory();
            } catch (error) {
                this.hideTyping(messagesContainer);
                console.error('AI Error:', error);
                
                let errorContent = `Sorry, I encountered an error: ${error.message}`;
                
                // If it's a server configuration error, provide helpful message
                if (error.message.includes('Server configuration') || error.message.includes('OPENAI_API_KEY')) {
                    errorContent = `⚠️ **Server Configuration Required**\n\nThis AI Assistant requires server-side configuration.\n\nThe administrator needs to:\n1. Set the OPENAI_API_KEY environment variable on the server\n2. Deploy the /api/chat.js serverless function\n\nIf you're the administrator, check your deployment platform's environment variables settings.`;
                }
                
                const errorMessage = { 
                    role: 'assistant', 
                    content: errorContent, 
                    timestamp: Date.now() 
                };
                this.addMessage(errorMessage, messagesContainer);
                this.chatHistory.push(errorMessage);
                this.saveHistory();
            }

            sendBtn.disabled = false;
        };

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Suggestion card clicks
        const suggestionCards = content.querySelectorAll('.suggestion-card');
        suggestionCards.forEach(card => {
            card.addEventListener('click', () => {
                const suggestion = card.dataset.suggestion;
                input.value = suggestion;
                
                // Hide welcome screen
                const welcomeScreen = content.querySelector('#chat-welcome-screen');
                if (welcomeScreen) {
                    welcomeScreen.style.opacity = '0';
                    welcomeScreen.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        welcomeScreen.style.display = 'none';
                    }, 300);
                }
                
                // Send the message
                setTimeout(() => {
                    sendMessage();
                }, 100);
            });
        });
    }

    async getAIResponse(userMessage) {
        // Build messages array
        const messages = [
            {
                role: 'system',
                content: `You are a helpful AI assistant for AegisDesk, an AI-powered desktop operating system. You can help users:
- Open applications (tasks, notes, weather, browser, settings, youtube, google)
- Create tasks in the tasks app
- Answer questions and provide information
- Navigate to websites
- Provide general assistance

When a user asks to open an app or create a task, the system will handle it automatically. You should respond naturally and confirm the action.

Be conversational, helpful, and concise. Keep responses brief and friendly.`
            },
            ...this.chatHistory.slice(-10).filter(msg => msg.role && msg.content).map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            { role: 'user', content: userMessage }
        ];

        try {
            // Call our secure serverless API endpoint
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                let errorMessage = errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
                
                // Handle server configuration errors
                if (errorMessage.includes('OPENAI_API_KEY') || errorMessage.includes('Missing') || errorMessage.includes('Server configuration')) {
                    throw new Error('Server configuration error. The OPENAI_API_KEY environment variable may not be set on the server.');
                }
                
                // Handle OpenAI API errors
                if (errorData.details && errorData.details.message) {
                    errorMessage = errorData.details.message;
                }
                
                throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            }

            const data = await response.json();
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('Invalid response from API');
            }
            
            return data.choices[0].message.content || 'I apologize, but I could not generate a response.';
        } catch (error) {
            console.error('AI API error:', error);
            // Re-throw with a more user-friendly message
            if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                throw new Error('Authentication failed. Please check server configuration.');
            } else if (error.message.includes('429') || error.message.includes('rate limit')) {
                throw new Error('Rate limit exceeded. Please try again in a moment.');
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                throw new Error('Network error. Please check your internet connection.');
            }
            throw error;
        }
    }

    detectFunctionCall(userMessage) {
        const lowerMessage = userMessage.toLowerCase().trim();
        
        // Detect "open app" commands - more patterns
        const openPatterns = {
            'tasks': ['open task', 'open tasks', 'open tasks app', 'show task', 'show tasks', 'launch task', 'start task', 'open the task'],
            'notes': ['open note', 'open notes', 'open notes app', 'show note', 'show notes', 'launch note', 'start note', 'open the note'],
            'weather': ['open weather', 'show weather', 'weather app', 'launch weather', 'open the weather'],
            'browser': ['open browser', 'open web', 'show browser', 'launch browser', 'open the browser'],
            'bookmarks': ['open bookmark', 'open bookmarks', 'show bookmark', 'show bookmarks'],
            'google': ['open google', 'go to google', 'show google', 'launch google', 'open the google'],
            'youtube': ['open youtube', 'go to youtube', 'show youtube', 'launch youtube', 'open the youtube', 'watch youtube'],
            'settings': ['open setting', 'open settings', 'show setting', 'show settings', 'launch setting', 'open the setting'],
            'ai-chat': ['open ai', 'open assistant', 'open chat', 'show ai', 'show assistant']
        };

        for (const [appId, patterns] of Object.entries(openPatterns)) {
            for (const pattern of patterns) {
                // Use word boundary or start of string to avoid false matches
                if (lowerMessage === pattern || 
                    lowerMessage.startsWith(pattern + ' ') || 
                    lowerMessage.includes(' ' + pattern + ' ') ||
                    lowerMessage.endsWith(' ' + pattern)) {
                    return { name: 'open_app', appId: appId };
                }
            }
        }

        // Detect "create task" commands - improved patterns
        const taskPatterns = [
            { pattern: 'create task', remove: 'create task' },
            { pattern: 'add task', remove: 'add task' },
            { pattern: 'new task', remove: 'new task' },
            { pattern: 'make a task', remove: 'make a task' },
            { pattern: 'add a task', remove: 'add a task' },
            { pattern: 'create a task', remove: 'create a task' },
            { pattern: 'task to', remove: 'task to' },
            { pattern: 'remind me to', remove: 'remind me to' },
            { pattern: 'remind me', remove: 'remind me' },
            { pattern: 'i need to', remove: 'i need to' },
            { pattern: 'i should', remove: 'i should' },
            { pattern: 'i must', remove: 'i must' },
            { pattern: 'i have to', remove: 'i have to' }
        ];

        for (const { pattern, remove } of taskPatterns) {
            if (lowerMessage.includes(pattern)) {
                // Extract task text
                let taskText = userMessage;
                const index = lowerMessage.indexOf(pattern);
                if (index !== -1) {
                    taskText = userMessage.substring(index + remove.length).trim();
                    // Clean up common prefixes
                    taskText = taskText.replace(/^(to|that|about|for)\s+/i, '').trim();
                    
                    // Remove trailing punctuation if it's just one
                    taskText = taskText.replace(/^["']|["']$/g, '').trim();
                    
                    if (taskText && taskText.length > 0) {
                        return { name: 'create_task', taskText: taskText };
                    }
                }
            }
        }

        return null;
    }

    async handleFunctionCall(functionCall, messagesContainer) {
        if (functionCall.name === 'open_app') {
            // Open the requested app
            setTimeout(() => {
                desktop.openApp(functionCall.appId);
                const appNames = {
                    'tasks': 'Tasks',
                    'notes': 'Notes',
                    'weather': 'Weather',
                    'browser': 'Browser',
                    'bookmarks': 'Bookmarks',
                    'google': 'Google',
                    'youtube': 'YouTube',
                    'settings': 'Settings',
                    'ai-chat': 'AI Assistant'
                };
                
                // Check if it's a bookmark
                if (typeof bookmarksApp !== 'undefined') {
                    const bookmark = bookmarksApp.findBookmark(functionCall.appId);
                    if (bookmark) {
                        browserApp.open(bookmark.url, bookmark.name);
                        this.addSystemMessage(messagesContainer, `✓ Opening ${bookmark.name}...`);
                        return;
                    }
                }
                const appName = appNames[functionCall.appId] || functionCall.appId;
                this.addSystemMessage(messagesContainer, `✓ Opening ${appName}...`);
            }, 100);
        } else if (functionCall.name === 'create_task') {
            // Create a task
            try {
                const tasks = storage.get('tasks', []);
                tasks.push({
                    text: functionCall.taskText,
                    completed: false,
                    createdAt: Date.now()
                });
                storage.set('tasks', tasks);
                
                // Open tasks app (will refresh if already open)
                setTimeout(() => {
                    if (!windowManager.windows.has('tasks')) {
                        tasksApp.open();
                    } else {
                        // Refresh the tasks list
                        const tasksWindow = windowManager.windows.get('tasks');
                        if (tasksWindow) {
                            const content = tasksWindow.querySelector('.window-content');
                            tasksApp.refresh(content);
                        }
                    }
                }, 100);
                
                this.addSystemMessage(messagesContainer, `✓ Task created: "${functionCall.taskText}"`);
            } catch (error) {
                console.error('Error creating task:', error);
            }
        }
    }

    addSystemMessage(container, text) {
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message';
        messageEl.style.opacity = '0.7';
        messageEl.innerHTML = `
            <div class="chat-avatar" style="background: rgba(34, 197, 94, 0.2);">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <div class="chat-content" style="background: rgba(34, 197, 94, 0.1); border-color: rgba(34, 197, 94, 0.3);">
                ${this.escapeHtml(text)}
            </div>
        `;
        container.appendChild(messageEl);
        container.scrollTop = container.scrollHeight;
    }

    addMessage(message, container) {
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${message.role}`;
        messageEl.innerHTML = `
            <div class="chat-avatar">
                ${message.role === 'user' 
                    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
                    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>'
                }
            </div>
            <div class="chat-content">
                ${this.formatMessage(message.content)}
            </div>
        `;
        container.appendChild(messageEl);
        container.scrollTop = container.scrollHeight;
    }

    showTyping(container) {
        this.isTyping = true;
        const typingEl = document.createElement('div');
        typingEl.className = 'chat-message';
        typingEl.id = 'typing-indicator';
        typingEl.innerHTML = `
            <div class="chat-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                </svg>
            </div>
            <div class="chat-content">
                <div class="chat-typing">
                    <div class="chat-typing-dot"></div>
                    <div class="chat-typing-dot"></div>
                    <div class="chat-typing-dot"></div>
                </div>
            </div>
        `;
        container.appendChild(typingEl);
        container.scrollTop = container.scrollHeight;
    }

    hideTyping(container) {
        this.isTyping = false;
        const typingEl = container.querySelector('#typing-indicator');
        if (typingEl) typingEl.remove();
    }

    loadHistory(window) {
        const messagesContainer = window.querySelector('#chat-messages');
        const welcomeScreen = window.querySelector('#chat-welcome-screen');
        
        if (this.chatHistory.length > 0) {
            // Hide welcome screen if there's history
            if (welcomeScreen) {
                welcomeScreen.style.display = 'none';
            }
            messagesContainer.innerHTML = this.chatHistory.map(msg => this.renderMessage(msg)).join('');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } else {
            // Ensure welcome screen is visible if no history
            if (welcomeScreen) {
                welcomeScreen.style.display = 'flex';
                welcomeScreen.style.opacity = '1';
            }
        }
    }

    saveHistory() {
        // Keep only last 50 messages
        if (this.chatHistory.length > 50) {
            this.chatHistory = this.chatHistory.slice(-50);
        }
        storage.set('aiChatHistory', this.chatHistory);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const aiChatApp = new AIChatApp();
