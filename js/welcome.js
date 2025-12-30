// Welcome Page Interactions
document.addEventListener('DOMContentLoaded', () => {
    // Initialize clock numbers
    function initClockNumbers() {
        const numbers12 = document.getElementById('clock-numbers-12');
        
        if (numbers12) {
            // Create 12-hour numbers (1-12) - centered on clock face
            for (let i = 1; i <= 12; i++) {
                const number = document.createElement('div');
                number.className = 'clock-number clock-number-12';
                number.textContent = i;
                const angle = (i * 30) - 90; // -90 to start at top
                const radius = 115; // Centered radius for better visibility
                const x = Math.cos(angle * Math.PI / 180) * radius;
                const y = Math.sin(angle * Math.PI / 180) * radius;
                number.style.left = `calc(50% + ${x}px)`;
                number.style.top = `calc(50% + ${y}px)`;
                number.style.transform = 'translate(-50%, -50%)';
                number.style.zIndex = '10';
                numbers12.appendChild(number);
            }
        }
    }
    
    // Initialize numbers on page load
    initClockNumbers();
    
    // Clock functionality - India time
    function updateClock() {
        // Get India time (Asia/Kolkata)
        const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        // Update clock hands - using 24-hour format for rotation
        const hoursHand = document.getElementById('clock-hours');
        const minutesHand = document.getElementById('clock-minutes');
        const secondsHand = document.getElementById('clock-seconds');
        const timeText12 = document.getElementById('clock-time-12');
        const dateText = document.getElementById('clock-date-text');
        
        // Hour hand: rotates based on 24-hour format (full 360 degrees)
        if (hoursHand) {
            const hoursDeg24 = (hours * 15) + (minutes * 0.25); // 360/24 = 15 degrees per hour
            hoursHand.style.transform = `rotate(${hoursDeg24}deg)`;
        }
        
        // Minute hand: rotates 360 degrees per hour
        if (minutesHand) {
            const minutesDeg = (minutes * 6) + (seconds * 0.1); // 360/60 = 6 degrees per minute
            minutesHand.style.transform = `rotate(${minutesDeg}deg)`;
        }
        
        // Second hand: rotates 360 degrees per minute
        if (secondsHand) {
            const secondsDeg = seconds * 6; // 360/60 = 6 degrees per second
            secondsHand.style.transform = `rotate(${secondsDeg}deg)`;
        }
        
        // Update 12-hour time display
        if (timeText12) {
            const hours12 = hours % 12 || 12;
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const timeString12 = `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}`;
            timeText12.textContent = timeString12;
        }
        
        if (dateText) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateText.textContent = now.toLocaleDateString('en-US', options);
        }
    }
    
    // Update clock immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });

    // Add parallax effect to orbs
    window.addEventListener('mousemove', (e) => {
        const orbs = document.querySelectorAll('.gradient-orb');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * 50 * speed;
            const y = (mouseY - 0.5) * 50 * speed;
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
});

