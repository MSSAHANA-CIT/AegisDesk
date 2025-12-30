// Welcome Page Interactions
document.addEventListener('DOMContentLoaded', () => {
    // Clock functionality
    function updateClock() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        // Update clock hands
        const hoursHand = document.getElementById('clock-hours');
        const minutesHand = document.getElementById('clock-minutes');
        const secondsHand = document.getElementById('clock-seconds');
        const timeText = document.getElementById('clock-time-text');
        const dateText = document.getElementById('clock-date-text');
        
        if (hoursHand) {
            const hoursDeg = (hours % 12) * 30 + minutes * 0.5;
            hoursHand.style.transform = `rotate(${hoursDeg}deg)`;
        }
        
        if (minutesHand) {
            const minutesDeg = minutes * 6 + seconds * 0.1;
            minutesHand.style.transform = `rotate(${minutesDeg}deg)`;
        }
        
        if (secondsHand) {
            const secondsDeg = seconds * 6;
            secondsHand.style.transform = `rotate(${secondsDeg}deg)`;
        }
        
        if (timeText) {
            const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            timeText.textContent = timeString;
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

