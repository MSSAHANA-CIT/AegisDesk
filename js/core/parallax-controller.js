// Parallax Desktop Controller
class ParallaxController {
    constructor() {
        this.enabled = true;
        this.intensity = 0.02;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.cursorGlow = null;
        this.animationFrame = null;
    }

    init() {
        if (!this.enabled) return;
        
        this.cursorGlow = document.getElementById('cursor-glow');
        document.body.classList.add('parallax-active');
        
        // Mouse move handler
        document.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });
        
        // Mouse leave handler
        document.addEventListener('mouseleave', () => {
            this.handleMouseLeave();
        });
        
        // Start animation loop
        this.animate();
    }

    handleMouseMove(e) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Calculate offset from center
        const offsetX = (e.clientX - centerX) * this.intensity;
        const offsetY = (e.clientY - centerY) * this.intensity;
        
        this.targetX = offsetX;
        this.targetY = offsetY;
        
        // Update cursor glow position
        if (this.cursorGlow) {
            this.cursorGlow.style.setProperty('--mouse-x', e.clientX + 'px');
            this.cursorGlow.style.setProperty('--mouse-y', e.clientY + 'px');
            this.cursorGlow.classList.add('active');
        }
    }

    handleMouseLeave() {
        // Reset to center
        this.targetX = 0;
        this.targetY = 0;
        
        if (this.cursorGlow) {
            this.cursorGlow.classList.remove('active');
        }
    }

    animate() {
        // Smooth interpolation
        this.currentX += (this.targetX - this.currentX) * 0.1;
        this.currentY += (this.targetY - this.currentY) * 0.1;
        
        // Apply to CSS variables
        document.documentElement.style.setProperty('--parallax-x', this.currentX + 'px');
        document.documentElement.style.setProperty('--parallax-y', this.currentY + 'px');
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        document.body.classList.remove('parallax-active');
    }
}

const parallaxController = new ParallaxController();
