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
                <div class="world-clock-markers"></div>
                <div class="world-clock-hour-hand" data-hand="hour"></div>
                <div class="world-clock-minute-hand" data-hand="minute"></div>
                <div class="world-clock-center"></div>
            </div>
            <div class="world-clock-city">${timezone.city}</div>
            <div class="world-clock-time" data-time>00:00:00</div>
            <div class="world-clock-date" data-date>Mon, Jan 1</div>
            <div class="world-clock-timezone">${timezone.tz.replace('_', ' ')}</div>
        `;

        // Add clock markers
        const markers = item.querySelector('.world-clock-markers');
        for (let i = 0; i < 12; i++) {
            const marker = document.createElement('div');
            marker.className = `world-clock-marker ${i % 3 === 0 ? 'major' : ''}`;
            const angle = i * 30;
            marker.style.transform = `rotate(${angle}deg) translateY(0)`;
            markers.appendChild(marker);
        }

        return item;
    }

    updateClocks() {
        document.querySelectorAll('.world-clock-item').forEach(item => {
            const timezone = item.dataset.timezone;
            const now = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
            
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            
            const hourHand = item.querySelector('[data-hand="hour"]');
            const minuteHand = item.querySelector('[data-hand="minute"]');
            const timeDisplay = item.querySelector('[data-time]');
            const dateDisplay = item.querySelector('[data-date]');
            
            // Update hands
            const hourAngle = (hours % 12) * 30 + minutes * 0.5;
            const minuteAngle = minutes * 6 + seconds * 0.1;
            
            if (hourHand) {
                hourHand.style.transform = `rotate(${hourAngle}deg)`;
            }
            if (minuteHand) {
                minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
            }
            
            // Update time display
            if (timeDisplay) {
                const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                timeDisplay.textContent = timeString;
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

