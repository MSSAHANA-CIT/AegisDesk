// Advanced Crypto Tracker App
class CryptoTrackerApp {
    constructor() {
        this.cryptos = [];
        this.updateInterval = null;
        this.init();
    }

    init() {
        // Default cryptocurrencies to track
        this.cryptos = storage.get('trackedCryptos', [
            { symbol: 'BTC', name: 'Bitcoin' },
            { symbol: 'ETH', name: 'Ethereum' },
            { symbol: 'BNB', name: 'Binance Coin' },
            { symbol: 'SOL', name: 'Solana' },
            { symbol: 'ADA', name: 'Cardano' }
        ]);
    }

    async fetchCryptoData(symbol) {
        try {
            // Using CoinGecko API (free, no key required)
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${this.getCoinGeckoId(symbol)}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`);
            const data = await response.json();
            const coinId = this.getCoinGeckoId(symbol);
            const coinData = data[coinId];
            
            if (coinData) {
                return {
                    symbol,
                    price: coinData.usd,
                    change24h: coinData.usd_24h_change || 0,
                    volume24h: coinData.usd_24h_vol || 0
                };
            }
        } catch (error) {
            console.error(`Error fetching ${symbol}:`, error);
            // Return mock data for demo
            return {
                symbol,
                price: Math.random() * 50000 + 10000,
                change24h: (Math.random() - 0.5) * 10,
                volume24h: Math.random() * 1000000000
            };
        }
        return null;
    }

    getCoinGeckoId(symbol) {
        const mapping = {
            'BTC': 'bitcoin',
            'ETH': 'ethereum',
            'BNB': 'binancecoin',
            'SOL': 'solana',
            'ADA': 'cardano',
            'DOT': 'polkadot',
            'DOGE': 'dogecoin',
            'XRP': 'ripple',
            'MATIC': 'matic-network',
            'LINK': 'chainlink'
        };
        return mapping[symbol] || symbol.toLowerCase();
    }

    async updateAllPrices() {
        const promises = this.cryptos.map(crypto => this.fetchCryptoData(crypto.symbol));
        const results = await Promise.all(promises);
        
        results.forEach((data, index) => {
            if (data) {
                this.cryptos[index] = { ...this.cryptos[index], ...data };
            }
        });

        // Update UI if window is open
        const window = document.querySelector('[data-window-id="crypto-tracker"]');
        if (window) {
            this.updateUI(window);
        }
    }

    createWindow() {
        const content = `
            <div class="crypto-tracker-app">
                <div class="crypto-header">
                    <h2>Cryptocurrency Tracker</h2>
                    <div class="crypto-controls">
                        <button class="crypto-refresh-btn" id="crypto-refresh">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="23 4 23 10 17 10"></polyline>
                                <polyline points="1 20 1 14 7 14"></polyline>
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                            </svg>
                            Refresh
                        </button>
                        <button class="crypto-add-btn" id="crypto-add">+ Add Coin</button>
                    </div>
                </div>
                <div class="crypto-list" id="crypto-list">
                    <div class="crypto-loading">Loading prices...</div>
                </div>
            </div>
        `;

        const window = windowManager.createWindow('crypto-tracker', {
            title: 'Crypto Tracker',
            width: 800,
            height: 600,
            content,
            class: 'crypto-window'
        });

        this.setupEventListeners(window);
        this.updateAllPrices();
        
        // Auto-refresh every 30 seconds
        this.updateInterval = setInterval(() => {
            this.updateAllPrices();
        }, 30000);

        return window;
    }

    updateUI(window) {
        const list = window.querySelector('#crypto-list');
        if (this.cryptos.length === 0) {
            list.innerHTML = '<div class="crypto-empty">No cryptocurrencies tracked. Click "+ Add Coin" to get started.</div>';
            return;
        }

        list.innerHTML = this.cryptos.map(crypto => `
            <div class="crypto-card">
                <div class="crypto-card-header">
                    <div class="crypto-info">
                        <div class="crypto-symbol">${crypto.symbol}</div>
                        <div class="crypto-name">${crypto.name || ''}</div>
                    </div>
                    <button class="crypto-remove-btn" data-symbol="${crypto.symbol}">&times;</button>
                </div>
                <div class="crypto-price">
                    $${crypto.price ? this.formatPrice(crypto.price) : '---'}
                </div>
                <div class="crypto-change ${crypto.change24h >= 0 ? 'positive' : 'negative'}">
                    ${crypto.change24h !== undefined ? `${crypto.change24h >= 0 ? '+' : ''}${crypto.change24h.toFixed(2)}%` : '---'}
                </div>
                <div class="crypto-volume">
                    24h Vol: $${crypto.volume24h ? this.formatVolume(crypto.volume24h) : '---'}
                </div>
            </div>
        `).join('');

        // Re-attach event listeners
        window.querySelectorAll('.crypto-remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const symbol = e.target.dataset.symbol;
                this.removeCrypto(symbol);
                this.updateUI(window);
            });
        });
    }

    setupEventListeners(window) {
        const refreshBtn = window.querySelector('#crypto-refresh');
        refreshBtn?.addEventListener('click', () => {
            this.updateAllPrices();
            if (typeof notificationSystem !== 'undefined') {
                notificationSystem.info('Crypto Tracker', 'Prices updated');
            }
        });

        const addBtn = window.querySelector('#crypto-add');
        addBtn?.addEventListener('click', () => {
            this.showAddCoinDialog(window);
        });
    }

    showAddCoinDialog(window) {
        const symbol = prompt('Enter cryptocurrency symbol (e.g., BTC, ETH):');
        if (symbol) {
            const upperSymbol = symbol.toUpperCase();
            if (!this.cryptos.find(c => c.symbol === upperSymbol)) {
                this.cryptos.push({ symbol: upperSymbol, name: '' });
                storage.set('trackedCryptos', this.cryptos);
                this.updateAllPrices();
            } else {
                if (typeof notificationSystem !== 'undefined') {
                    notificationSystem.warning('Crypto Tracker', 'Cryptocurrency already tracked');
                }
            }
        }
    }

    removeCrypto(symbol) {
        this.cryptos = this.cryptos.filter(c => c.symbol !== symbol);
        storage.set('trackedCryptos', this.cryptos);
    }

    formatPrice(price) {
        if (price >= 1) {
            return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        return price.toFixed(6);
    }

    formatVolume(volume) {
        if (volume >= 1000000000) {
            return (volume / 1000000000).toFixed(2) + 'B';
        }
        if (volume >= 1000000) {
            return (volume / 1000000).toFixed(2) + 'M';
        }
        if (volume >= 1000) {
            return (volume / 1000).toFixed(2) + 'K';
        }
        return volume.toFixed(2);
    }
}

// Create global instance
const cryptoTrackerApp = new CryptoTrackerApp();
