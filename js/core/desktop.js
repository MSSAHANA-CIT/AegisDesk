// Desktop Core
class Desktop {
    constructor() {
        this.appsMenu = null;
        this.searchInput = null;
        this.init();
    }

    init() {
        console.log('Desktop initializing...');
        
        // Initialize apps menu
        this.appsMenu = document.getElementById('apps-menu');
        if (!this.appsMenu) {
            console.error('Apps menu not found!');
        }
        
        // Initialize search
        this.searchInput = document.getElementById('global-search');
        if (!this.searchInput) {
            console.error('Search input not found!');
        } else {
            console.log('Search input found:', this.searchInput);
        }
        
        // Setup event listeners
        this.setupAppsMenu();
        this.setupTaskbar();
        this.setupSearch();
        this.setupClock();
        this.setupKeyboardShortcuts();
        
        // Apply saved icon size on load
        this.applySavedIconSize();
        
        // Load saved window states
        this.restoreWindows();
        
        console.log('Desktop initialized successfully');
        
        // Test search after a short delay to ensure everything is loaded
        setTimeout(() => {
            if (this.searchInput) {
                console.log('Search input is ready');
                // Test if browserApp is available
                if (typeof browserApp !== 'undefined') {
                    console.log('browserApp is available');
                } else {
                    console.error('browserApp is NOT available!');
                }
            }
        }, 500);
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

        // Render apps from registry
        this.renderAppsMenu(menu);
        
        // Use event delegation for app tiles (works with dynamically rendered tiles)
        menu.addEventListener('click', (e) => {
            const tile = e.target.closest('.app-tile');
            if (tile) {
                const appId = tile.dataset.app;
                const url = tile.dataset.url;
                
                menu.classList.remove('visible');
                
                setTimeout(() => {
                    this.openApp(appId, url);
                }, 100);
            }
        });

        // Icon size controls
        this.setupIconSizeControls(menu);
        
        // Explore button
        const exploreBtn = menu.querySelector('[data-action="explore"]');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.open('explore.html', '_blank');
            });
        }
    }

    setupTaskbar() {
        // Pinned app icons
        document.querySelectorAll('.taskbar-icon[data-app]').forEach(icon => {
            icon.addEventListener('click', () => {
                const appId = icon.dataset.app;
                this.openApp(appId);
            });
        });

        // Theme switcher button
        const themeSwitcherBtn = document.getElementById('theme-switcher-btn');
        if (themeSwitcherBtn && typeof themeSystem !== 'undefined') {
            themeSwitcherBtn.addEventListener('click', () => {
                const newTheme = themeSystem.cycleTheme();
                if (typeof notificationSystem !== 'undefined') {
                    notificationSystem.info('Theme Changed', `Switched to ${themeSystem.themes[newTheme].name} theme`);
                }
            });
        }

        // Quick actions button
        const quickActionsBtn = document.getElementById('quick-actions-btn');
        if (quickActionsBtn && typeof quickActions !== 'undefined') {
            quickActionsBtn.addEventListener('click', () => {
                quickActions.toggle();
            });
        }
    }

    setupSearch() {
        if (!this.searchInput) {
            console.error('Search input not found!');
            return;
        }

        console.log('Setting up search functionality...');
        console.log('Search input element:', this.searchInput);
        console.log('browserApp available:', typeof browserApp !== 'undefined');

        // Handle Enter key
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                const query = this.searchInput.value.trim();
                console.log('Enter pressed, query:', query);
                if (query) {
                    this.handleSearch(query);
                } else {
                    this.searchInput.focus();
                }
            }
        });

        // Also handle keypress as backup
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                const query = this.searchInput.value.trim();
                console.log('Enter pressed (keypress), query:', query);
                if (query) {
                    this.handleSearch(query);
                }
            }
        });

        // Add search button if it doesn't exist
        const searchBar = this.searchInput.closest('.search-bar');
        if (searchBar) {
            // Remove existing search button if any
            const existingBtn = searchBar.querySelector('.search-btn');
            if (existingBtn) {
                existingBtn.remove();
            }

            const searchBtn = document.createElement('button');
            searchBtn.className = 'search-btn';
            searchBtn.type = 'button'; // Prevent form submission
            searchBtn.setAttribute('aria-label', 'Search');
            searchBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
            `;
            searchBtn.style.cssText = 'background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 6px; color: var(--primary-light); cursor: pointer; padding: 6px 10px; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; flex-shrink: 0; min-width: 32px; min-height: 32px;';
            
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const query = this.searchInput.value.trim();
                console.log('Search button clicked, query:', query);
                if (query) {
                    this.handleSearch(query);
                } else {
                    this.searchInput.focus();
                }
            });

            searchBtn.addEventListener('mouseenter', () => {
                searchBtn.style.color = 'var(--text-primary)';
                searchBtn.style.transform = 'scale(1.1)';
            });

            searchBtn.addEventListener('mouseleave', () => {
                searchBtn.style.color = 'var(--text-muted)';
                searchBtn.style.transform = 'scale(1)';
            });

            searchBar.appendChild(searchBtn);
            console.log('Search button added');
        } else {
            console.error('Search bar not found!');
        }
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
        // Update every 30 seconds instead of every second (huge performance gain)
        setInterval(updateClock, 30000);
        
        // Update immediately every minute on the minute
        const secondsUntilNextMinute = 60000 - (new Date().getSeconds() * 1000 + new Date().getMilliseconds());
        setTimeout(() => {
            updateClock();
            setInterval(updateClock, 60000); // Then update every minute
        }, secondsUntilNextMinute);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + Space: Show apps menu
            if (e.altKey && e.key === ' ') {
                e.preventDefault();
                this.appsMenu.classList.toggle('visible');
            }

            // Escape: Close apps menu or close active window
            if (e.key === 'Escape') {
                this.appsMenu.classList.remove('visible');
                const activeWindow = document.querySelector('.window.active');
                if (activeWindow && !e.target.closest('.window-content input, .window-content textarea')) {
                    windowManager.closeWindow(activeWindow);
                }
            }

            // Alt + F4: Close active window
            if (e.altKey && e.key === 'F4') {
                e.preventDefault();
                const activeWindow = document.querySelector('.window.active');
                if (activeWindow) {
                    windowManager.closeWindow(activeWindow);
                }
            }

            // Alt + Tab: Switch between windows
            if (e.altKey && e.key === 'Tab') {
                e.preventDefault();
                this.switchWindows();
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

            // Ctrl + F: Focus search
            if (e.ctrlKey && e.key === 'f' && !e.target.closest('input, textarea')) {
                e.preventDefault();
                if (this.searchInput) {
                    this.searchInput.focus();
                    this.searchInput.select();
                }
            }

            // Ctrl + W: Close active window
            if (e.ctrlKey && e.key === 'w' && !e.target.closest('input, textarea')) {
                e.preventDefault();
                const activeWindow = document.querySelector('.window.active');
                if (activeWindow) {
                    windowManager.closeWindow(activeWindow);
                }
            }

            // T key: Cycle theme (when not typing)
            if (e.key === 't' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.target.closest('input, textarea')) {
                if (typeof themeSystem !== 'undefined') {
                    const newTheme = themeSystem.cycleTheme();
                    if (typeof notificationSystem !== 'undefined') {
                        notificationSystem.info('Theme Changed', `Switched to ${themeSystem.themes[newTheme].name} theme`);
                    }
                }
            }

            // T key: Cycle theme (when not typing)
            if (e.key === 't' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.target.closest('input, textarea')) {
                if (typeof themeSystem !== 'undefined') {
                    const newTheme = themeSystem.cycleTheme();
                    if (typeof notificationSystem !== 'undefined') {
                        notificationSystem.info('Theme Changed', `Switched to ${themeSystem.themes[newTheme].name} theme`);
                    }
                }
            }
        });
    }

    switchWindows() {
        const windows = Array.from(windowManager.windows.values());
        if (windows.length < 2) return;
        
        const currentIndex = windows.findIndex(w => w.classList.contains('active'));
        const nextIndex = (currentIndex + 1) % windows.length;
        
        windowManager.focusWindow(windows[nextIndex]);
    }

    renderAppsMenu(menu) {
        if (typeof APP_REGISTRY === 'undefined') {
            console.warn('APP_REGISTRY not available, using static HTML');
            return;
        }

        const appsGrid = menu.querySelector('.apps-grid');
        if (!appsGrid) return;

        // Get app order (preserve existing order from HTML if possible)
        const appOrder = ['tasks', 'notes', 'weather', 'ai-chat', 'code-editor', 'terminal', 'music-player', 'drawing', 'system-monitor', 'gallery', 'playground', 'browser', 'bookmarks', 'calculator', 'calendar', 'files', 'settings', 'email', 'crypto-tracker', 'news-reader', 'help'];
        
        // Render apps from registry
        appsGrid.innerHTML = appOrder.map(appId => {
            const app = APP_REGISTRY[appId];
            if (!app) return '';
            
            // Check if app has special URL (for ai-chat, browser)
            let urlAttr = '';
            if (appId === 'ai-chat') {
                urlAttr = 'data-url="ai-chat.html"';
            } else if (appId === 'browser') {
                urlAttr = 'data-url="https://www.google.com"';
            }
            
            return `
                <div class="app-tile" data-app="${appId}" ${urlAttr}>
                    <div class="app-tile-icon">
                        ${app.iconSVG}
                    </div>
                    <div class="app-tile-name">${app.title}</div>
                </div>
            `;
        }).join('');
    }

    openApp(appId, url = null) {
        console.log('Opening app:', appId, 'with URL:', url);
        
        // Use APP_REGISTRY if available
        if (typeof APP_REGISTRY !== 'undefined' && APP_REGISTRY[appId]) {
            const app = APP_REGISTRY[appId];
            try {
                // Pass URL if provided (for browser, youtube, etc.)
                if (url) {
                    app.open(url);
                } else {
                    app.open();
                }
                return;
            } catch (error) {
                console.error('Error opening app from registry:', appId, error);
                // Fallback to legacy method
            }
        }
        
        // Fallback to legacy method
        this.openAppLegacy(appId, url);
    }

    openAppLegacy(appId, url = null) {
        switch (appId) {
            case 'tasks':
                if (typeof tasksApp !== 'undefined') tasksApp.open();
                break;
            case 'notes':
                if (typeof notesApp !== 'undefined') notesApp.open();
                break;
            case 'weather':
                if (typeof weatherApp !== 'undefined') weatherApp.open();
                break;
            case 'ai-chat':
                // Always open ai-chat.html in a new window/tab
                const aiChatUrl = url || 'ai-chat.html';
                console.log('Opening AI Assistant:', aiChatUrl);
                window.open(aiChatUrl, '_blank');
                break;
            case 'browser':
                if (typeof browserApp !== 'undefined') {
                    const appUrl = url || 'https://www.google.com';
                    console.log('Opening browser with URL:', appUrl, 'Title: Browser');
                    browserApp.open(appUrl, 'Browser');
                } else {
                    console.error('browserApp is not defined!');
                    alert('Browser app is not available. Please refresh the page.');
                }
                break;
            case 'bookmarks':
                if (typeof bookmarksApp !== 'undefined') bookmarksApp.open();
                break;
            case 'calculator':
                if (typeof calculatorApp !== 'undefined') calculatorApp.open();
                break;
            case 'calendar':
                if (typeof calendarApp !== 'undefined') calendarApp.open();
                break;
            case 'files':
                if (typeof filesApp !== 'undefined') filesApp.open();
                break;
            case 'settings':
                if (typeof settingsApp !== 'undefined') settingsApp.open();
                break;
            default:
                // Try to find bookmark
                if (typeof bookmarksApp !== 'undefined') {
                    const bookmark = bookmarksApp.findBookmark(appId);
                    if (bookmark && typeof browserApp !== 'undefined') {
                        browserApp.open(bookmark.url, bookmark.name);
                        return;
                    }
                }
                console.warn('Unknown app:', appId);
        }
    }

    handleSearch(query) {
        if (!query || !query.trim()) {
            console.log('Empty query, ignoring');
            return;
        }
        
        const lowerQuery = query.toLowerCase().trim();
        const originalQuery = query.trim();
        
        console.log('=== HANDLING SEARCH ===');
        console.log('Original query:', originalQuery);
        console.log('Lower query:', lowerQuery);
        console.log('browserApp available:', typeof browserApp !== 'undefined');
        console.log('APP_REGISTRY available:', typeof APP_REGISTRY !== 'undefined');
        
        try {
            // Check if it's a URL (has dots and looks like a domain)
            if (originalQuery.includes('.') && (originalQuery.includes('http') || originalQuery.match(/^[a-zA-Z0-9-]+\.[a-zA-Z]/))) {
                // It's a URL - open it
                let url = originalQuery;
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                }
                console.log('Detected URL, opening:', url);
                if (typeof browserApp !== 'undefined' && browserApp) {
                    browserApp.open(url, 'Browser');
                    this.searchInput.value = '';
                    return;
                } else {
                    console.error('browserApp is not defined!');
                    alert('Browser app is not available. Please refresh the page.');
                    return;
                }
            }

            // Check for app names using APP_REGISTRY (case-insensitive)
            // Build search map from registry
            const appMap = {};
            const aliases = {
                'task': 'tasks',
                'tasks': 'tasks',
                'note': 'notes',
                'notes': 'notes',
                'weather': 'weather',
                'ai': 'ai-chat',
                'assistant': 'ai-chat',
                'chat': 'ai-chat',
                'browser': 'browser',
                'code-editor': 'code-editor',
                'codeeditor': 'code-editor',
                'editor': 'code-editor',
                'terminal': 'terminal',
                'music': 'music-player',
                'musicplayer': 'music-player',
                'drawing': 'drawing',
                'draw': 'drawing',
                'monitor': 'system-monitor',
                'system': 'system-monitor',
                'gallery': 'gallery',
                'photos': 'gallery',
                'playground': 'playground',
                'sandbox': 'playground',
                'yt': 'youtube',
                'setting': 'settings',
                'settings': 'settings',
                'file': 'files',
                'files': 'files',
                'calc': 'calculator',
                'calculator': 'calculator',
                'calendar': 'calendar',
                'bookmark': 'bookmarks',
                'bookmarks': 'bookmarks'
            };
            
            // Add registry titles and aliases
            if (typeof APP_REGISTRY !== 'undefined') {
                Object.keys(APP_REGISTRY).forEach(appId => {
                    const app = APP_REGISTRY[appId];
                    const titleLower = app.title.toLowerCase();
                    appMap[titleLower] = appId;
                    appMap[appId] = appId;
                });
            }
            
            // Add aliases (override registry if needed)
            Object.entries(aliases).forEach(([alias, appId]) => {
                appMap[alias] = appId;
            });

            // Check for exact app name matches first
            if (appMap[lowerQuery]) {
                console.log('Detected app name, opening:', appMap[lowerQuery]);
                const targetAppId = appMap[lowerQuery];
                this.openApp(targetAppId);
                this.searchInput.value = '';
                return;
            }

            // Check if query matches any app title (case-insensitive partial match)
            if (typeof APP_REGISTRY !== 'undefined') {
                for (const [appId, app] of Object.entries(APP_REGISTRY)) {
                    const titleLower = app.title.toLowerCase();
                    if (titleLower.includes(lowerQuery) || lowerQuery.includes(titleLower)) {
                        console.log('Matched app by title, opening:', appId);
                        this.openApp(appId);
                        this.searchInput.value = '';
                        return;
                    }
                }
            }

            // Check if query starts with app keywords
            for (const [keyword, appId] of Object.entries(appMap)) {
                if (lowerQuery === keyword || lowerQuery.startsWith(keyword + ' ')) {
                    console.log('Detected app keyword, opening:', appId);
                    this.openApp(appId);
                    this.searchInput.value = '';
                    return;
                }
            }

            // If it's not a URL and not an app, treat it as a Google search
            // Open browser with Google search
            const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(originalQuery);
            console.log('Treating as Google search, opening:', searchUrl);
            
            if (typeof browserApp !== 'undefined' && browserApp) {
                browserApp.open(searchUrl, 'Google Search');
                this.searchInput.value = '';
            } else {
                console.error('browserApp is not defined!');
                console.error('Available globals:', Object.keys(window).filter(k => k.includes('App') || k.includes('app')));
                alert('Browser app is not available. Please refresh the page.');
            }
        } catch (error) {
            console.error('Error in handleSearch:', error);
            alert('An error occurred while searching. Please try again.');
        }
    }

    setupIconSizeControls(menu) {
        const sizeButtons = menu.querySelectorAll('.icon-size-btn[data-size]');
        const appTiles = menu.querySelectorAll('.app-tile');
        
        // Load saved size preference
        const savedSize = storage.get('iconSize', 'medium');
        this.setIconSize(savedSize, sizeButtons, appTiles);
        
        sizeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const size = btn.dataset.size;
                this.setIconSize(size, sizeButtons, appTiles);
                storage.set('iconSize', size);
            });
        });
    }

    applySavedIconSize() {
        // Apply saved icon size immediately on page load
        const savedSize = storage.get('iconSize', 'medium');
        const menu = this.appsMenu;
        if (menu) {
            const sizeButtons = menu.querySelectorAll('.icon-size-btn[data-size]');
            const appTiles = menu.querySelectorAll('.app-tile');
            this.setIconSize(savedSize, sizeButtons, appTiles);
        }
    }

    setIconSize(size, sizeButtons, appTiles) {
        // Update button states
        sizeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === size);
        });
        
        // Update icon sizes
        appTiles.forEach(tile => {
            const icon = tile.querySelector('.app-tile-icon');
            if (icon) {
                icon.className = 'app-tile-icon size-' + size;
            }
        });
    }

    restoreWindows() {
        // Windows are restored individually when opened via window manager
        // This could be enhanced to auto-restore all windows on startup
    }
}

const desktop = new Desktop();

