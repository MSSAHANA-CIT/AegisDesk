// Weather App - Tamil Nadu Cities
class WeatherApp {
    constructor() {
        this.windowId = 'weather';
        this.apiKey = 'your_api_key_here'; // Replace with actual API key
        this.cities = [
            'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
            'Tirunelveli', 'Tiruppur', 'Erode', 'Vellore', 'Thoothukudi',
            'Dindigul', 'Thanjavur', 'Hosur', 'Nagercoil', 'Karur',
            'Kanchipuram', 'Neyveli', 'Kumbakonam', 'Cuddalore', 'Avadi',
            'Rajapalayam', 'Pollachi', 'Sivakasi', 'Tiruvannamalai', 'Pudukkottai',
            'Ooty', 'Kodaikanal', 'Yercaud', 'Kanyakumari', 'Mahabalipuram'
        ];
    }

    open() {
        const content = this.render();
        const window = windowManager.createWindow(this.windowId, {
            title: 'Weather - Tamil Nadu',
            width: 900,
            height: 700,
            class: 'app-weather',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v6m0 6v6"></path>
                <path d="M18 8a6 6 0 01-6 6"></path>
                <path d="M6 8a6 6 0 006 6"></path>
            </svg>`,
            content: content
        });

        this.attachEvents(window);
        this.loadWeather(window);
    }

    render() {
        return `
            <div class="weather-container">
                <div class="weather-header">
                    <h2>Tamil Nadu Weather</h2>
                    <a href="weather-forecast.html" target="_blank" class="weather-forecast-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        <span>View Detailed Forecast</span>
                    </a>
                </div>
                <div class="weather-cities" id="weather-cities">
                    ${this.renderLoading()}
                </div>
            </div>
        `;
    }

    renderLoading() {
        return `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                <div class="window-loading-spinner" style="margin: 0 auto 16px;"></div>
                <p>Loading weather data...</p>
            </div>
        `;
    }

    renderCities(weatherData) {
        return weatherData.map(city => `
            <div class="weather-city-card">
                <div class="city-name">${this.escapeHtml(city.name)}</div>
                <div class="city-weather-main">
                    <div>
                        <div class="city-temp">${Math.round(city.temp)}°C</div>
                        <div class="city-condition">${city.condition}</div>
                    </div>
                    <div style="font-size: 48px;">${this.getWeatherIcon(city.condition)}</div>
                </div>
                <div class="city-details">
                    <div class="city-detail-item">
                        <span>Feels like</span>
                        <span>${Math.round(city.feelsLike)}°C</span>
                    </div>
                    <div class="city-detail-item">
                        <span>Humidity</span>
                        <span>${city.humidity}%</span>
                    </div>
                    <div class="city-detail-item">
                        <span>Wind</span>
                        <span>${city.windSpeed} km/h</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadWeather(window) {
        const container = window.querySelector('#weather-cities');
        
        // For demo purposes, using sample data
        // To use real weather data, you would need:
        // 1. A geocoding service to get coordinates for each city
        // 2. Or use a weather API that accepts city names directly
        // 3. Or maintain a city coordinates database
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            const weatherData = this.getSampleWeatherData();
            container.innerHTML = this.renderCities(weatherData);
        }, 800);
    }

    getSampleWeatherData() {
        return this.cities.map(city => this.getSampleCityData(city));
    }

    getSampleCityData(cityName) {
        const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Thunderstorm'];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        
        return {
            name: cityName,
            temp: Math.round(25 + Math.random() * 10),
            feelsLike: Math.round(26 + Math.random() * 10),
            humidity: Math.round(60 + Math.random() * 30),
            windSpeed: Math.round(5 + Math.random() * 15),
            condition: condition
        };
    }

    getWeatherCondition(code) {
        // WMO Weather interpretation codes
        const codes = {
            0: 'Clear', 1: 'Clear', 2: 'Partly Cloudy', 3: 'Cloudy',
            45: 'Foggy', 48: 'Foggy', 51: 'Drizzle', 53: 'Drizzle',
            55: 'Drizzle', 61: 'Rainy', 63: 'Rainy', 65: 'Rainy',
            71: 'Snowy', 73: 'Snowy', 75: 'Snowy', 77: 'Snowy',
            80: 'Rainy', 81: 'Rainy', 82: 'Rainy', 85: 'Snowy',
            86: 'Snowy', 95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
        };
        return codes[code] || 'Clear';
    }

    getWeatherIcon(condition) {
        const icons = {
            'Sunny': '☀️',
            'Clear': '☀️',
            'Partly Cloudy': '⛅',
            'Cloudy': '☁️',
            'Rainy': '🌧️',
            'Drizzle': '🌦️',
            'Thunderstorm': '⛈️',
            'Snowy': '❄️',
            'Foggy': '🌫️'
        };
        return icons[condition] || '☀️';
    }

    attachEvents(window) {
        // Refresh button could be added here
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const weatherApp = new WeatherApp();

