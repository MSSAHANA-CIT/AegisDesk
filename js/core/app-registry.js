// App Registry - Centralized app definitions
const APP_REGISTRY = {
    'tasks': {
        title: 'Tasks',
        iconSVG: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
        </svg>`,
        open: function() {
            if (typeof tasksApp !== 'undefined') {
                tasksApp.open();
            }
        }
    },
    'notes': {
        title: 'Notes',
        iconSVG: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
            <path d="M14 2v6h6"></path>
        </svg>`,
        open: function() {
            if (typeof notesApp !== 'undefined') {
                notesApp.open();
            }
        }
    },
    'weather': {
        title: 'Weather',
        iconSVG: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v6m0 6v6"></path>
            <path d="M18 8a6 6 0 01-6 6"></path>
            <path d="M6 8a6 6 0 006 6"></path>
        </svg>`,
        open: function() {
            if (typeof weatherApp !== 'undefined') {
                weatherApp.open();
            }
        }
    },
    'ai-chat': {
        title: 'AI Assistant',
        iconSVG: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
        </svg>`,
        open: function(url) {
            // Always open ai-chat.html - use provided URL or default
            const aiChatUrl = url || 'ai-chat.html';
            console.log('AI Assistant opening:', aiChatUrl);
            window.open(aiChatUrl, '_blank');
        }
    },
    'browser': {
        title: 'Browser',
        iconSVG: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path>
        </svg>`,
        open: function(url) {
            if (typeof browserApp !== 'undefined') {
                const targetUrl = url || 'https://www.google.com';
                browserApp.open(targetUrl, 'Browser');
            }
        }
    },
    'code-editor': {
        title: 'Code Editor',
        iconSVG: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
        </svg>`,
        open: function() {
            if (typeof codeEditorApp !== 'undefined') {
                codeEditorApp.open();
            }
        }
    },
    'terminal': {
        title: 'Terminal',
        iconSVG: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="4 7 4 4 20 4 20 7"></polyline>
            <line x1="9" y1="20" x2="15" y2="20"></line>
            <line x1="12" y1="4" x2="12" y2="20"></line>
        </svg>`,
        open: function() {
            if (typeof terminalApp !== 'undefined') {
                terminalApp.open();
            }
        }
    },
    'music-player': {
        title: 'Music Player',
        iconSVG: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="10 8 16 12 10 16 10 8"></polygon>
        </svg>`,
        open: function() {
            if (typeof musicPlayerApp !== 'undefined') {
                musicPlayerApp.open();
            }
        }
    },
    'drawing': {
        title: 'Drawing',
        iconSVG: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>`,
        open: function() {
            if (typeof drawingApp !== 'undefined') {
                drawingApp.open();
            }
        }
    },
    'system-monitor': {
        title: 'System Monitor',
        iconSVG: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>`,
        open: function() {
            if (typeof systemMonitorApp !== 'undefined') {
                systemMonitorApp.open();
            }
        }
    },
    'gallery': {
        title: 'Photo Gallery',
        iconSVG: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
        </svg>`,
        open: function() {
            if (typeof galleryApp !== 'undefined') {
                galleryApp.open();
            }
        }
    },
    'playground': {
        title: 'Code Playground',
        iconSVG: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>`,
        open: function() {
            if (typeof playgroundApp !== 'undefined') {
                playgroundApp.open();
            }
        }
    },
    'bookmarks': {
        title: 'Bookmarks',
        iconSVG: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"></path>
        </svg>`,
        open: function() {
            if (typeof bookmarksApp !== 'undefined') {
                bookmarksApp.open();
            }
        }
    },
    'calculator': {
        title: 'Calculator',
        iconSVG: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
            <line x1="8" y1="6" x2="16" y2="6"></line>
            <line x1="8" y1="10" x2="16" y2="10"></line>
            <line x1="8" y1="14" x2="16" y2="14"></line>
            <line x1="8" y1="18" x2="16" y2="18"></line>
        </svg>`,
        open: function() {
            if (typeof calculatorApp !== 'undefined') {
                calculatorApp.open();
            }
        }
    },
    'calendar': {
        title: 'Calendar',
        iconSVG: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>`,
        open: function() {
            if (typeof calendarApp !== 'undefined') {
                calendarApp.open();
            }
        }
    },
    'files': {
        title: 'Files',
        iconSVG: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 20h16a2 2 0 002-2V8a2 2 0 00-2-2h-7.93a2 2 0 01-1.66-.9l-.82-1.2A2 2 0 004.43 2H4a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>`,
        open: function() {
            if (typeof filesApp !== 'undefined') {
                filesApp.open();
            }
        }
    },
    'settings': {
        title: 'Settings',
        iconSVG: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
        </svg>`,
        open: function() {
            if (typeof settingsApp !== 'undefined') {
                settingsApp.open();
            }
        }
    }
};

// Attach to window for global access
if (typeof window !== 'undefined') {
    window.APP_REGISTRY = APP_REGISTRY;
}
