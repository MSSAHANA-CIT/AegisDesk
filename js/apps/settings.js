// Settings App
class SettingsApp {
    constructor() {
        this.windowId = 'settings';
        this.settings = storage.get('settings', {
            theme: 'dark',
            animations: true,
            autoSave: true,
            openaiApiKey: '' // DO NOT hardcode API keys - user must enter their own
        });
        
        // Note: API key should be entered by user through the settings UI
        // We don't set a default key for security reasons
    }

    open() {
        const content = this.render();
        const window = windowManager.createWindow(this.windowId, {
            title: 'Settings',
            width: 700,
            height: 600,
            class: 'app-settings',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
            </svg>`,
            content: content
        });

        this.attachEvents(window);
    }

    render() {
        return `
            <div class="settings-container">
                <div class="settings-header">
                    <h2>Settings</h2>
                </div>
                
                <div class="settings-section">
                    <div class="settings-section-title">General</div>
                    <div class="settings-item">
                        <div class="settings-item-label">
                            <div class="settings-item-title">Enable Animations</div>
                            <div class="settings-item-desc">Smooth transitions and animations throughout the interface</div>
                        </div>
                        <div class="settings-toggle ${this.settings.animations ? 'active' : ''}" data-setting="animations">
                            <div class="settings-toggle-slider"></div>
                        </div>
                    </div>
                    
                    <div class="settings-item">
                        <div class="settings-item-label">
                            <div class="settings-item-title">Auto-save</div>
                            <div class="settings-item-desc">Automatically save your work as you type</div>
                        </div>
                        <div class="settings-toggle ${this.settings.autoSave ? 'active' : ''}" data-setting="autoSave">
                            <div class="settings-toggle-slider"></div>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <div class="settings-section-title">AI Assistant</div>
                    <div class="settings-item">
                        <div class="settings-item-label" style="flex: 1;">
                            <div class="settings-item-title">OpenAI API Key</div>
                            <div class="settings-item-desc">Enter your OpenAI API key to enable AI Assistant features</div>
                            <input type="password" 
                                   id="openai-api-key" 
                                   value="${this.escapeHtml(storage.get('openai_api_key', this.settings.openaiApiKey))}" 
                                   placeholder="sk-..."
                                   style="margin-top: 8px; width: 100%; padding: 8px 12px; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border); border-radius: 6px; color: var(--text-primary); font-size: 13px; font-family: 'JetBrains Mono', monospace;">
                            <small style="color: var(--text-muted); font-size: 11px; margin-top: 4px; display: block;">
                                🔒 Your API key is stored locally in your browser and never sent anywhere except OpenAI's servers.<br>
                                📝 Get your API key at: <a href="https://platform.openai.com/api-keys" target="_blank" style="color: var(--primary-light); text-decoration: underline;">platform.openai.com/api-keys</a>
                            </small>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <div class="settings-section-title">Data</div>
                    <div class="settings-item">
                        <div class="settings-item-label" style="flex: 1;">
                            <div class="settings-item-title">Clear All Data</div>
                            <div class="settings-item-desc">Remove all saved data including tasks, notes, and preferences</div>
                            <button id="clear-data-btn" style="margin-top: 12px; padding: 8px 16px; background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.5); border-radius: 6px; color: #ef4444; cursor: pointer; font-size: 13px;">
                                Clear All Data
                            </button>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <div class="settings-section-title">Installation</div>
                    <div class="settings-item">
                        <div class="settings-item-label" style="flex: 1;">
                            <div class="settings-item-title">Install AegisDesk</div>
                            <div class="settings-item-desc">Install AegisDesk as a desktop app for offline access and better performance</div>
                            <button id="install-pwa-btn" style="margin-top: 12px; padding: 10px 20px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border: none; border-radius: 8px; color: white; cursor: pointer; font-size: 14px; font-weight: 500; display: none;">
                                Install AegisDesk
                            </button>
                            <div id="pwa-install-status" style="margin-top: 8px; font-size: 12px; color: var(--text-muted);"></div>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <div class="settings-section-title">About</div>
                    <div class="settings-item">
                        <div class="settings-item-label" style="flex: 1;">
                            <div class="settings-item-title">AegisDesk</div>
                            <div class="settings-item-desc" style="margin-top: 8px;">
                                Version 1.0.0<br>
                                AI-Powered Unified Desktop Operating System for Personal Productivity<br><br>
                                Built with ❤️ for organizing your digital life.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    attachEvents(window) {
        const content = window.querySelector('.window-content');
        
        // Toggle switches
        content.querySelectorAll('.settings-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const setting = toggle.dataset.setting;
                const isActive = toggle.classList.contains('active');
                
                toggle.classList.toggle('active');
                this.settings[setting] = !isActive;
                this.save();
                
                // Apply settings
                if (setting === 'animations') {
                    document.body.style.setProperty('--animations', this.settings.animations ? '1' : '0');
                }
            });
        });

        // API Key input
        const apiKeyInput = content.querySelector('#openai-api-key');
        let saveTimeout;
        apiKeyInput.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                this.settings.openaiApiKey = apiKeyInput.value.trim();
                storage.set('openai_api_key', this.settings.openaiApiKey);
                this.save();
            }, 1000);
        });

        // Clear data button
        const clearDataBtn = content.querySelector('#clear-data-btn');
        clearDataBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                storage.clear();
                this.settings = { theme: 'dark', animations: true, autoSave: true, openaiApiKey: '' };
                this.save();
                alert('All data has been cleared. The page will reload.');
                location.reload();
            }
        });

        // PWA Install button
        this.setupPWAInstall(content);
    }

    setupPWAInstall(content) {
        const installBtn = content.querySelector('#install-pwa-btn');
        const statusEl = content.querySelector('#pwa-install-status');
        
        if (!installBtn) return;

        let deferredPrompt = null;

        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installBtn.style.display = 'block';
            if (statusEl) statusEl.textContent = 'AegisDesk can be installed on your device.';
        });

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
            installBtn.style.display = 'none';
            if (statusEl) statusEl.textContent = '✓ AegisDesk is installed.';
        }

        // Install button click
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) {
                if (statusEl) statusEl.textContent = 'Installation not available. Please use your browser\'s install option.';
                return;
            }

            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                if (statusEl) statusEl.textContent = '✓ Installation started!';
                installBtn.style.display = 'none';
            } else {
                if (statusEl) statusEl.textContent = 'Installation cancelled.';
            }
            
            deferredPrompt = null;
        });
    }

    save() {
        storage.set('settings', this.settings);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const settingsApp = new SettingsApp();

