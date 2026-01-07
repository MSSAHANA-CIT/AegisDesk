// Music Player App
class MusicPlayerApp {
    constructor() {
        this.windowId = 'music-player';
        this.playlist = storage.get('musicPlaylist', [
            { name: 'Ocean Waves', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', artist: 'Nature' },
            { name: 'Ambient Sound', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', artist: 'Ambient' }
        ]);
        this.currentTrack = 0;
        this.isPlaying = false;
        this.audio = null;
    }

    open() {
        const content = this.render();
        const window = windowManager.createWindow(this.windowId, {
            title: 'Music Player',
            width: 600,
            height: 700,
            class: 'app-music-player',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
            </svg>`,
            content: content
        });

        this.attachEvents(window);
    }

    render() {
        const track = this.playlist[this.currentTrack] || {};
        
        return `
            <div class="music-player-container">
                <div class="music-player-artwork">
                    <div class="music-artwork-placeholder">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18V5l12-2v13"></path>
                            <circle cx="6" cy="18" r="3"></circle>
                            <circle cx="18" cy="16" r="3"></circle>
                        </svg>
                    </div>
                </div>
                <div class="music-player-info">
                    <h2 class="music-track-name">${track.name || 'No Track'}</h2>
                    <p class="music-track-artist">${track.artist || 'Unknown Artist'}</p>
                </div>
                <div class="music-player-controls">
                    <button class="music-btn" id="prev-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="19 20 9 12 19 4 19 20"></polygon>
                            <line x1="5" y1="19" x2="5" y2="5"></line>
                        </svg>
                    </button>
                    <button class="music-btn music-btn-play" id="play-pause-btn">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" id="play-icon">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" id="pause-icon" style="display: none;">
                            <rect x="6" y="4" width="4" height="16"></rect>
                            <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                    </button>
                    <button class="music-btn" id="next-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="5 4 15 12 5 20 5 4"></polygon>
                            <line x1="19" y1="5" x2="19" y2="19"></line>
                        </svg>
                    </button>
                </div>
                <div class="music-player-progress">
                    <span class="music-time" id="current-time">0:00</span>
                    <input type="range" class="music-progress-bar" id="progress-bar" min="0" max="100" value="0">
                    <span class="music-time" id="total-time">0:00</span>
                </div>
                <div class="music-player-volume">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"></path>
                    </svg>
                    <input type="range" class="music-volume-bar" id="volume-bar" min="0" max="100" value="70">
                </div>
                <div class="music-playlist">
                    <h3>Playlist</h3>
                    <div class="music-playlist-items" id="playlist-items">
                        ${this.playlist.map((track, index) => `
                            <div class="music-playlist-item ${index === this.currentTrack ? 'active' : ''}" data-index="${index}">
                                <div class="playlist-item-info">
                                    <div class="playlist-item-name">${this.escapeHtml(track.name)}</div>
                                    <div class="playlist-item-artist">${this.escapeHtml(track.artist)}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    attachEvents(window) {
        const playPauseBtn = window.querySelector('#play-pause-btn');
        const prevBtn = window.querySelector('#prev-btn');
        const nextBtn = window.querySelector('#next-btn');
        const progressBar = window.querySelector('#progress-bar');
        const volumeBar = window.querySelector('#volume-bar');
        const playlistItems = window.querySelectorAll('.music-playlist-item');

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.togglePlay(window);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.previousTrack(window);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextTrack(window);
            });
        }

        if (progressBar) {
            progressBar.addEventListener('input', (e) => {
                if (this.audio) {
                    this.audio.currentTime = (e.target.value / 100) * this.audio.duration;
                }
            });
        }

        if (volumeBar) {
            volumeBar.addEventListener('input', (e) => {
                if (this.audio) {
                    this.audio.volume = e.target.value / 100;
                }
            });
        }

        playlistItems.forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.playTrack(index, window);
            });
        });
    }

    togglePlay(window) {
        const track = this.playlist[this.currentTrack];
        if (!track) return;

        if (!this.audio) {
            this.audio = new Audio(track.url);
            this.audio.addEventListener('timeupdate', () => {
                this.updateProgress(window);
            });
            this.audio.addEventListener('ended', () => {
                this.nextTrack(window);
            });
        }

        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        } else {
            this.audio.play();
            this.isPlaying = true;
        }

        this.updatePlayButton(window);
    }

    previousTrack(window) {
        this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
        this.playTrack(this.currentTrack, window);
    }

    nextTrack(window) {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.playTrack(this.currentTrack, window);
    }

    playTrack(index, window) {
        if (index >= 0 && index < this.playlist.length) {
            if (this.audio) {
                this.audio.pause();
            }
            this.currentTrack = index;
            this.isPlaying = false;
            this.togglePlay(window);
            this.refresh(window);
        }
    }

    updateProgress(window) {
        if (this.audio) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            const progressBar = window.querySelector('#progress-bar');
            const currentTime = window.querySelector('#current-time');
            const totalTime = window.querySelector('#total-time');
            
            if (progressBar) progressBar.value = progress || 0;
            if (currentTime) currentTime.textContent = this.formatTime(this.audio.currentTime);
            if (totalTime) totalTime.textContent = this.formatTime(this.audio.duration);
        }
    }

    updatePlayButton(window) {
        const playIcon = window.querySelector('#play-icon');
        const pauseIcon = window.querySelector('#pause-icon');
        
        if (this.isPlaying) {
            if (playIcon) playIcon.style.display = 'none';
            if (pauseIcon) pauseIcon.style.display = 'block';
        } else {
            if (playIcon) playIcon.style.display = 'block';
            if (pauseIcon) pauseIcon.style.display = 'none';
        }
    }

    formatTime(seconds) {
        if (!isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    refresh(window) {
        const content = window.querySelector('.window-content');
        content.innerHTML = this.render();
        this.attachEvents(window);
        if (this.isPlaying && this.audio) {
            this.updatePlayButton(window);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const musicPlayerApp = new MusicPlayerApp();
