// World Clock
class WorldClock {
    constructor() {
        this.timezones = [
            { city: 'New York', tz: 'America/New_York', offset: -5 },
            { city: 'London', tz: 'Europe/London', offset: 0 },
            { city: 'Tokyo', tz: 'Asia/Tokyo', offset: 9 },
            { city: 'Sydney', tz: 'Australia/Sydney', offset: 10 },
            { city: 'Dubai', tz: 'Asia/Dubai', offset: 4 },
            { city: 'Mumbai', tz: 'Asia/Kolkata', offset: 5.5 },
            { city: 'Paris', tz: 'Europe/Paris', offset: 1 },
            { city: 'Singapore', tz: 'Asia/Singapore', offset: 8 },
            { city: 'Los Angeles', tz: 'America/Los_Angeles', offset: -8 },
            { city: 'Beijing', tz: 'Asia/Shanghai', offset: 8 },
            { city: 'Moscow', tz: 'Europe/Moscow', offset: 3 },
            { city: 'Toronto', tz: 'America/Toronto', offset: -5 }
        ];
        this.init();
    }

    init() {
        const grid = document.getElementById('world-clock-grid');
        if (!grid) return;

        this.timezones.forEach((tz, index) => {
            const clockItem = this.createClock(tz, index);
            grid.appendChild(clockItem);
        });

        // Update clocks every second
        setInterval(() => this.updateClocks(), 1000);
        this.updateClocks();
    }

    createClock(timezone, index) {
        const item = document.createElement('div');
        item.className = 'world-clock-item';
        item.dataset.timezone = timezone.tz;
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100);

        item.innerHTML = `
            <div class="world-clock-face">
                <div class="world-clock-numbers-12"></div>
                <div class="world-clock-hour-hand" data-hand="hour"></div>
                <div class="world-clock-minute-hand" data-hand="minute"></div>
                <div class="world-clock-center"></div>
            </div>
            <div class="world-clock-city">${timezone.city}</div>
            <div class="world-clock-time-display">
                <div class="world-clock-time-12" data-time-12>12:00:00 AM</div>
            </div>
            <div class="world-clock-date" data-date>Mon, Jan 1</div>
            <div class="world-clock-timezone">${timezone.tz.replace('_', ' ')}</div>
        `;

        // Add 12-hour numbers (1-12) - centered on clock face
        const numbers12 = item.querySelector('.world-clock-numbers-12');
        for (let i = 1; i <= 12; i++) {
            const number = document.createElement('div');
            number.className = 'world-clock-number world-clock-number-12';
            number.textContent = i;
            const angle = (i * 30) - 90;
            const radius = 57; // Centered radius for 140px clock face (70px radius)
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;
            number.style.left = `calc(50% + ${x}px)`;
            number.style.top = `calc(50% + ${y}px)`;
            number.style.transform = 'translate(-50%, -50%)';
            number.style.zIndex = '15';
            numbers12.appendChild(number);
        }

        return item;
    }

    updateClocks() {
        document.querySelectorAll('.world-clock-item').forEach(item => {
            const timezone = item.dataset.timezone;
            // Use proper timezone conversion
            const now = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
            
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            
            const hourHand = item.querySelector('[data-hand="hour"]');
            const minuteHand = item.querySelector('[data-hand="minute"]');
            const timeDisplay12 = item.querySelector('[data-time-12]');
            const dateDisplay = item.querySelector('[data-date]');
            
            // Update hands - hour hand uses 24-hour format rotation
            const hourAngle = (hours * 15) + (minutes * 0.25); // 360/24 = 15 degrees per hour
            const minuteAngle = (minutes * 6) + (seconds * 0.1); // 360/60 = 6 degrees per minute
            
            if (hourHand) {
                hourHand.style.transform = `rotate(${hourAngle}deg)`;
            }
            if (minuteHand) {
                minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
            }
            
            // Update 12-hour time display
            if (timeDisplay12) {
                const hours12 = hours % 12 || 12;
                const ampm = hours >= 12 ? 'PM' : 'AM';
                const timeString12 = `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}`;
                timeDisplay12.textContent = timeString12;
            }
            
            // Update date display
            if (dateDisplay) {
                const dateString = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                dateDisplay.textContent = dateString;
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new WorldClock();
});

