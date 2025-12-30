// Window Manager
class WindowManager {
    constructor() {
        this.windows = new Map();
        this.zIndexCounter = 100;
        this.windowPositions = storage.get('windowPositions', {});
    }

    createWindow(appId, config = {}) {
        // Check if window already exists
        if (this.windows.has(appId)) {
            const existingWindow = this.windows.get(appId);
            this.focusWindow(existingWindow);
            return existingWindow;
        }

        const defaultConfig = {
            id: appId,
            title: config.title || appId,
            icon: config.icon || '',
            width: config.width || 600,
            height: config.height || 500,
            minWidth: config.minWidth || 300,
            minHeight: config.minHeight || 200,
            content: config.content || '',
            class: config.class || '',
            url: config.url || null
        };

        const window = this.buildWindow(defaultConfig);
        this.windows.set(appId, window);
        this.addWindowToDOM(window);
        this.setupWindowEvents(window);
        
        // Restore position if saved
        this.restoreWindowPosition(window);
        
        this.focusWindow(window);
        this.updateTaskbar();

        return window;
    }

    buildWindow(config) {
        const windowEl = document.createElement('div');
        windowEl.className = `window ${config.class}`;
        windowEl.dataset.windowId = config.id;
        windowEl.style.width = config.width + 'px';
        windowEl.style.height = config.height + 'px';
        windowEl.style.zIndex = this.zIndexCounter++;

        const savedPos = this.windowPositions[config.id];
        if (savedPos && !savedPos.maximized) {
            windowEl.style.left = savedPos.left + 'px';
            windowEl.style.top = savedPos.top + 'px';
        } else {
            // Center window
            windowEl.style.left = (window.innerWidth - config.width) / 2 + 'px';
            windowEl.style.top = (window.innerHeight - config.height) / 3 + 'px';
        }

        windowEl.innerHTML = `
            <div class="window-titlebar">
                <div class="window-titlebar-left">
                    ${config.icon ? `<div class="window-icon">${config.icon}</div>` : ''}
                    <div class="window-title">${config.title}</div>
                </div>
                <div class="window-titlebar-right">
                    <button class="window-button minimize" data-action="minimize">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                    <button class="window-button maximize" data-action="maximize">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"></path>
                        </svg>
                    </button>
                    <button class="window-button close" data-action="close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="window-content">${config.content}</div>
            <div class="window-resize-handle nw"></div>
            <div class="window-resize-handle ne"></div>
            <div class="window-resize-handle sw"></div>
            <div class="window-resize-handle se"></div>
            <div class="window-resize-handle n"></div>
            <div class="window-resize-handle s"></div>
            <div class="window-resize-handle e"></div>
            <div class="window-resize-handle w"></div>
        `;

        return windowEl;
    }

    addWindowToDOM(window) {
        const container = document.getElementById('windows-container');
        container.appendChild(window);
    }

    setupWindowEvents(window) {
        const titlebar = window.querySelector('.window-titlebar');
        const content = window.querySelector('.window-content');
        const resizeHandles = window.querySelectorAll('.window-resize-handle');
        const buttons = window.querySelectorAll('.window-button');

        // Drag
        dragManager.initDrag(window, titlebar);

        // Resize
        dragManager.initResize(window, resizeHandles);

        // Focus
        window.addEventListener('mousedown', () => this.focusWindow(window));

        // Buttons
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                this.handleWindowAction(window, action);
            });
        });

        // Prevent drag on content
        content.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            e.stopPropagation();
        });
    }

    handleWindowAction(window, action) {
        switch (action) {
            case 'minimize':
                this.minimizeWindow(window);
                break;
            case 'maximize':
                this.maximizeWindow(window);
                break;
            case 'close':
                this.closeWindow(window);
                break;
        }
    }

    minimizeWindow(window) {
        window.classList.add('minimized');
        this.updateTaskbar();
    }

    maximizeWindow(window) {
        const isMaximized = window.classList.contains('maximized');
        
        if (isMaximized) {
            // Restore
            window.classList.remove('maximized');
            const savedPos = this.windowPositions[window.dataset.windowId];
            if (savedPos) {
                window.style.left = savedPos.left + 'px';
                window.style.top = savedPos.top + 'px';
                window.style.width = savedPos.width + 'px';
                window.style.height = savedPos.height + 'px';
            }
        } else {
            // Maximize - save current position
            this.saveWindowPosition(window);
            window.classList.add('maximized');
        }
    }

    focusWindow(window) {
        // Update z-index
        window.style.zIndex = this.zIndexCounter++;
        
        // Update classes
        this.windows.forEach(w => {
            w.classList.remove('active');
            w.classList.add('inactive');
        });
        window.classList.add('active');
        window.classList.remove('inactive');
        window.classList.remove('minimized');

        this.updateTaskbar();
    }

    closeWindow(window) {
        const windowId = window.dataset.windowId;
        this.saveWindowPosition(window);
        window.classList.add('window-closing');
        
        setTimeout(() => {
            window.remove();
            this.windows.delete(windowId);
            this.updateTaskbar();
        }, 200);
    }

    saveWindowPosition(window) {
        if (window.classList.contains('maximized')) {
            this.windowPositions[window.dataset.windowId] = {
                ...this.windowPositions[window.dataset.windowId],
                maximized: true
            };
        } else {
            const rect = window.getBoundingClientRect();
            this.windowPositions[window.dataset.windowId] = {
                left: parseInt(window.style.left),
                top: parseInt(window.style.top),
                width: rect.width,
                height: rect.height,
                maximized: false
            };
        }
        storage.set('windowPositions', this.windowPositions);
    }

    restoreWindowPosition(window) {
        const savedPos = this.windowPositions[window.dataset.windowId];
        if (savedPos) {
            if (savedPos.maximized) {
                window.classList.add('maximized');
            } else {
                if (savedPos.left !== undefined) window.style.left = savedPos.left + 'px';
                if (savedPos.top !== undefined) window.style.top = savedPos.top + 'px';
                if (savedPos.width) window.style.width = savedPos.width + 'px';
                if (savedPos.height) window.style.height = savedPos.height + 'px';
            }
        }
    }

    updateTaskbar() {
        const taskbarWindows = document.getElementById('taskbar-windows');
        taskbarWindows.innerHTML = '';

        this.windows.forEach((window, id) => {
            const isMinimized = window.classList.contains('minimized');
            const isActive = window.classList.contains('active');

            const taskbarWindow = document.createElement('div');
            taskbarWindow.className = `taskbar-window ${isActive ? 'active' : ''}`;
            taskbarWindow.dataset.windowId = id;
            
            const icon = window.querySelector('.window-icon')?.innerHTML || '';
            const title = window.querySelector('.window-title')?.textContent || id;

            taskbarWindow.innerHTML = `
                <div class="taskbar-window-icon">${icon}</div>
                <span>${title}</span>
            `;

            taskbarWindow.addEventListener('click', () => {
                if (isMinimized) {
                    window.classList.remove('minimized');
                }
                this.focusWindow(window);
            });

            taskbarWindows.appendChild(taskbarWindow);
        });

        // Update pinned app icons
        document.querySelectorAll('.taskbar-icon[data-app]').forEach(icon => {
            const appId = icon.dataset.app;
            const isOpen = this.windows.has(appId);
            icon.classList.toggle('active', isOpen);
        });
    }
}

const windowManager = new WindowManager();

