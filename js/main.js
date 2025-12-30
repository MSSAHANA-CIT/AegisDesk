// Main Application Entry Point
document.addEventListener('DOMContentLoaded', () => {
    console.log('AegisDesk initialized');
    
    // Initialize desktop
    // (desktop is already initialized in desktop.js)
    
    // Welcome message (optional)
    setTimeout(() => {
        console.log('Welcome to AegisDesk! Press Alt+Space to open the apps menu.');
    }, 1000);
    
    // Prevent context menu on desktop (optional)
    document.addEventListener('contextmenu', (e) => {
        if (e.target.classList.contains('desktop-background')) {
            // Could show desktop context menu here
        }
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Ensure windows stay within bounds
            windowManager.windows.forEach(win => {
                const rect = win.getBoundingClientRect();
                const maxLeft = window.innerWidth - rect.width;
                const maxTop = window.innerHeight - rect.height - 48;
                
                if (parseInt(win.style.left) > maxLeft) {
                    win.style.left = Math.max(0, maxLeft) + 'px';
                }
                if (parseInt(win.style.top) > maxTop) {
                    win.style.top = Math.max(0, maxTop) + 'px';
                }
            });
        }, 250);
    });
    
    // Performance optimization: Use passive listeners where possible
    document.addEventListener('touchstart', () => {}, { passive: true });
});

