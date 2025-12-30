// Desktop Core
class Desktop {
    constructor() {
        this.appsMenu = null;
        this.searchInput = null;
        this.init();
    }

    init() {
        // Initialize apps menu
        this.appsMenu = document.getElementById('apps-menu');
        
        // Initialize search
        this.searchInput = document.getElementById('global-search');
        
        // Setup event listeners
        this.setupAppsMenu();
        this.setupTaskbar();
        this.setupSearch();
        this.setupClock();
        this.setupKeyboardShortcuts();
        
        // Load saved window states
        this.restoreWindows();
    }

    setupAppsMenu() {
        const showBtn = document.querySelector('[data-action="show-apps-menu"]');
        const hideBtn = document.querySelector('[data-action="hide-apps-menu"]');
        const menu = this.appsMenu;

        // Show menu
        showBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.add('visible');
        });

        // Hide menu
        hideBtn?.addEventListener('click', () => {
            menu.classList.remove('visible');
        });

        // Hide on outside click
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !showBtn.contains(e.target)) {
                menu.classList.remove('visible');
            }
        });

        // App tiles
        menu.querySelectorAll('.app-tile').forEach(tile => {
            tile.addEventListener('click', () => {
                const appId = tile.dataset.app;
                const url = tile.dataset.url;
                
                menu.classList.remove('visible');
                
                setTimeout(() => {
                    this.openApp(appId, url);
                }, 100);
            });
        });
    }

    setupTaskbar() {
        // Pinned app icons
        document.querySelectorAll('.taskbar-icon[data-app]').forEach(icon => {
            icon.addEventListener('click', () => {
                const appId = icon.dataset.app;
                this.openApp(appId);
            });
        });
    }

    setupSearch() {
        if (!this.searchInput) return;

        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = this.searchInput.value.trim();
                if (query) {
                    this.handleSearch(query);
                }
            }
        });

        this.searchInput.addEventListener('focus', () => {
            // Could show search suggestions here
        });
    }

    setupClock() {
        const updateClock = () => {
            const now = new Date();
            const timeEl = document.getElementById('time-display');
            const dateEl = document.getElementById('date-display');
            
            if (timeEl) {
                timeEl.textContent = now.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                });
            }
            
            if (dateEl) {
                dateEl.textContent = now.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                });
            }
        };

        updateClock();
        setInterval(updateClock, 1000);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + Space: Show apps menu
            if (e.altKey && e.key === ' ') {
                e.preventDefault();
                this.appsMenu.classList.toggle('visible');
            }

            // Escape: Close apps menu
            if (e.key === 'Escape') {
                this.appsMenu.classList.remove('visible');
            }

            // Alt + Number: Open pinned apps
            if (e.altKey && /^[1-9]$/.test(e.key)) {
                const index = parseInt(e.key) - 1;
                const pinnedApps = Array.from(document.querySelectorAll('.taskbar-icon[data-app]'));
                if (pinnedApps[index]) {
                    const appId = pinnedApps[index].dataset.app;
                    this.openApp(appId);
                }
            }
        });
    }

    openApp(appId, url = null) {
        switch (appId) {
            case 'tasks':
                tasksApp.open();
                break;
            case 'notes':
                notesApp.open();
                break;
            case 'weather':
                weatherApp.open();
                break;
            case 'ai-chat':
                aiChatApp.open();
                break;
            case 'browser':
            case 'youtube':
            case 'google':
                const appName = appId === 'youtube' ? 'YouTube' : appId === 'google' ? 'Google' : 'Browser';
                const appUrl = url || (appId === 'youtube' ? 'https://www.youtube.com' : 'https://www.google.com');
                browserApp.open(appUrl, appName);
                break;
            case 'bookmarks':
                bookmarksApp.open();
                break;
            case 'calculator':
                calculatorApp.open();
                break;
            case 'calendar':
                calendarApp.open();
                break;
            case 'files':
                filesApp.open();
                break;
            case 'settings':
                settingsApp.open();
                break;
            default:
                // Try to find bookmark
                if (typeof bookmarksApp !== 'undefined') {
                    const bookmark = bookmarksApp.findBookmark(appId);
                    if (bookmark) {
                        browserApp.open(bookmark.url, bookmark.name);
                        return;
                    }
                }
                console.warn('Unknown app:', appId);
        }
    }

    handleSearch(query) {
        // Simple search - could be enhanced with fuzzy matching
        const lowerQuery = query.toLowerCase();
        
        // Check if it's a URL
        if (query.includes('.') && (query.includes('http') || !query.includes(' '))) {
            browserApp.open(query, 'Browser');
            this.searchInput.value = '';
            return;
        }

        // Check for app names
        const appMap = {
            'task': 'tasks',
            'note': 'notes',
            'weather': 'weather',
            'ai': 'ai-chat',
            'assistant': 'ai-chat',
            'chat': 'ai-chat',
            'browser': 'browser',
            'google': 'browser',
            'youtube': 'browser',
            'setting': 'settings'
        };

        for (const [keyword, appId] of Object.entries(appMap)) {
            if (lowerQuery.includes(keyword)) {
                this.openApp(appId);
                this.searchInput.value = '';
                return;
            }
        }

        // Default: Open AI chat with query
        if (!windowManager.windows.has('ai-chat')) {
            aiChatApp.open();
            setTimeout(() => {
                const chatWindow = windowManager.windows.get('ai-chat');
                if (chatWindow) {
                    const input = chatWindow.querySelector('#chat-input');
                    if (input) {
                        input.value = query;
                        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                    }
                }
            }, 500);
        }
        
        this.searchInput.value = '';
    }

    restoreWindows() {
        // Windows are restored individually when opened via window manager
        // This could be enhanced to auto-restore all windows on startup
    }
}

const desktop = new Desktop();

