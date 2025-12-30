// Browser App
class BrowserApp {
    constructor() {
        this.windowId = 'browser';
        this.customApps = storage.get('customApps', [
            { name: 'Google', url: 'https://www.google.com', icon: '🌐' },
            { name: 'YouTube', url: 'https://www.youtube.com', icon: '▶️' }
        ]);
    }

    open(url = null, title = 'Browser') {
        const targetUrl = url || 'https://www.google.com';
        let windowId = url ? `browser_${Date.now()}` : this.windowId;
        
        // For YouTube/Google, always create a new window to ensure fresh content
        if (targetUrl.includes('youtube.com') || targetUrl.includes('google.com')) {
            windowId = `browser_${title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
        }
        
        // Close existing window if it exists to force recreation
        if (windowManager.windows.has(windowId)) {
            const existingWindow = windowManager.windows.get(windowId);
            windowManager.closeWindow(existingWindow);
        }
        
        const content = this.render(targetUrl);
        const window = windowManager.createWindow(windowId, {
            title: title,
            width: 1000,
            height: 700,
            class: 'app-browser',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path>
            </svg>`,
            content: content,
            url: targetUrl
        });

        this.attachEvents(window, targetUrl);
    }

    render(url) {
        // Check if URL is external (not local file)
        const isExternal = url.startsWith('http://') || url.startsWith('https://');
        
        if (isExternal) {
            // For external sites, show a message and offer to open in new tab
            return `
                <div class="browser-container">
                    <div class="browser-toolbar">
                        <button class="browser-nav-btn" id="browser-back" title="Back" disabled>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        <button class="browser-nav-btn" id="browser-forward" title="Forward" disabled>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                        <button class="browser-nav-btn" id="browser-refresh" title="Open in New Tab">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </button>
                        <input type="text" class="browser-url-bar" id="browser-url" value="${this.escapeHtml(url)}" readonly>
                        <button class="browser-nav-btn" id="browser-open-new" title="Open in New Tab">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="browser-content browser-external-message">
                        <div class="external-message-content">
                            <div class="external-message-icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path>
                                </svg>
                            </div>
                            <h3>External Website</h3>
                            <p>For security and compatibility reasons, external websites cannot be displayed in the embedded browser.</p>
                            <p style="margin-top: 12px; color: var(--text-muted);">Click the button below to open this site in a new browser tab.</p>
                            <button class="btn btn-primary" id="open-external-btn" style="margin-top: 24px; padding: 12px 24px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s ease;">
                                <span>Open ${this.getDomainFromUrl(url)} in New Tab</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                                    <polyline points="15 3 21 3 21 9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // For local files, use iframe
            return `
                <div class="browser-container">
                    <div class="browser-toolbar">
                        <button class="browser-nav-btn" id="browser-back" title="Back">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        <button class="browser-nav-btn" id="browser-forward" title="Forward">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                        <button class="browser-nav-btn" id="browser-refresh" title="Refresh">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="23 4 23 10 17 10"></polyline>
                                <polyline points="1 20 1 14 7 14"></polyline>
                                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"></path>
                            </svg>
                        </button>
                        <input type="text" class="browser-url-bar" id="browser-url" value="${this.escapeHtml(url)}">
                        <button class="browser-nav-btn" id="browser-home" title="Home">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                        </button>
                    </div>
                    <iframe class="browser-content" id="browser-content" src="${this.escapeHtml(url)}" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
                </div>
            `;
        }
    }
    
    getDomainFromUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.replace('www.', '');
        } catch (e) {
            return url;
        }
    }

    attachEvents(window, initialUrl) {
        const content = window.querySelector('.window-content');
        const urlBar = content.querySelector('#browser-url');
        const isExternal = initialUrl.startsWith('http://') || initialUrl.startsWith('https://');
        
        if (isExternal) {
            // Handle external URLs - open in new tab
            const openBtn = content.querySelector('#open-external-btn');
            const refreshBtn = content.querySelector('#browser-refresh');
            const openNewBtn = content.querySelector('#browser-open-new');
            
            const openInNewTab = () => {
                try {
                    const newWindow = window.open(initialUrl, '_blank', 'noopener,noreferrer');
                    if (!newWindow) {
                        // Popup blocked - try direct navigation
                        window.location.href = initialUrl;
                    }
                } catch (error) {
                    console.error('Error opening URL:', error);
                    // Fallback: try direct navigation
                    try {
                        window.location.href = initialUrl;
                    } catch (e) {
                        alert('Please enable popups or click the address bar to copy the URL: ' + initialUrl);
                    }
                }
            };
            
            if (openBtn) {
                openBtn.addEventListener('click', openInNewTab);
            }
            if (refreshBtn) {
                refreshBtn.addEventListener('click', openInNewTab);
            }
            if (openNewBtn) {
                openNewBtn.addEventListener('click', openInNewTab);
            }
            
            // Make URL bar clickable to copy or edit
            if (urlBar) {
                urlBar.addEventListener('click', () => {
                    urlBar.removeAttribute('readonly');
                    urlBar.select();
                });
                
                urlBar.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const newUrl = urlBar.value.trim();
                        if (newUrl) {
                            try {
                                const newWindow = window.open(newUrl, '_blank', 'noopener,noreferrer');
                                if (!newWindow) {
                                    window.location.href = newUrl;
                                }
                            } catch (error) {
                                window.location.href = newUrl;
                            }
                        }
                    }
                });
            }
        } else {
            // Handle local files with iframe
            const iframe = content.querySelector('#browser-content');
            const backBtn = content.querySelector('#browser-back');
            const forwardBtn = content.querySelector('#browser-forward');
            const refreshBtn = content.querySelector('#browser-refresh');
            const homeBtn = content.querySelector('#browser-home');

            let history = [initialUrl];
            let historyIndex = 0;

            // Navigate
            const navigate = (url) => {
                if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('file://')) {
                    url = 'https://' + url;
                }
                if (iframe) {
                    iframe.src = url;
                }
                if (urlBar) {
                    urlBar.value = url;
                }
                history = history.slice(0, historyIndex + 1);
                history.push(url);
                historyIndex++;
                updateButtons();
            };

            // Update button states
            const updateButtons = () => {
                if (backBtn) backBtn.disabled = historyIndex <= 0;
                if (forwardBtn) forwardBtn.disabled = historyIndex >= history.length - 1;
            };

            // URL bar
            if (urlBar) {
                urlBar.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        navigate(urlBar.value.trim());
                    }
                });
            }

            // Navigation buttons
            if (backBtn) {
                backBtn.addEventListener('click', () => {
                    if (historyIndex > 0 && iframe) {
                        historyIndex--;
                        iframe.src = history[historyIndex];
                        if (urlBar) urlBar.value = history[historyIndex];
                        updateButtons();
                    }
                });
            }

            if (forwardBtn) {
                forwardBtn.addEventListener('click', () => {
                    if (historyIndex < history.length - 1 && iframe) {
                        historyIndex++;
                        iframe.src = history[historyIndex];
                        if (urlBar) urlBar.value = history[historyIndex];
                        updateButtons();
                    }
                });
            }

            if (refreshBtn && iframe) {
                refreshBtn.addEventListener('click', () => {
                    iframe.src = iframe.src;
                });
            }

            if (homeBtn) {
                homeBtn.addEventListener('click', () => {
                    navigate('https://www.google.com');
                });
            }

            // Update URL bar when iframe navigates (if possible)
            if (iframe) {
                iframe.addEventListener('load', () => {
                    try {
                        if (urlBar && iframe.contentWindow) {
                            urlBar.value = iframe.contentWindow.location.href;
                        }
                    } catch (e) {
                        // Cross-origin, can't access
                    }
                });
            }

            updateButtons();
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const browserApp = new BrowserApp();

