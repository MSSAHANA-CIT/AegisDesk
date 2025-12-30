// Files App
class FilesApp {
    constructor() {
        this.windowId = 'files';
        this.files = storage.get('files', [
            { name: 'Documents', type: 'folder', size: '-', date: '2024-01-01' },
            { name: 'Pictures', type: 'folder', size: '-', date: '2024-01-01' },
            { name: 'Downloads', type: 'folder', size: '-', date: '2024-01-01' },
            { name: 'README.txt', type: 'file', size: '2.5 KB', date: '2024-01-15' }
        ]);
    }

    open() {
        const content = this.render();
        const window = windowManager.createWindow(this.windowId, {
            title: 'Files',
            width: 700,
            height: 500,
            class: 'app-files',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                <path d="M14 2v6h6"></path>
                <path d="M12 18v-6"></path>
                <path d="M9 15h6"></path>
            </svg>`,
            content: content
        });

        this.attachEvents(window);
    }

    render() {
        const filesHTML = this.files.map(file => `
            <div class="file-item" data-name="${this.escapeHtml(file.name)}">
                <div class="file-icon">
                    ${file.type === 'folder' ? 
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"></path></svg>' :
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><path d="M14 2v6h6"></path></svg>'
                    }
                </div>
                <div class="file-name">${this.escapeHtml(file.name)}</div>
                <div class="file-size">${file.size}</div>
                <div class="file-date">${file.date}</div>
            </div>
        `).join('');

        return `
            <div class="files-container">
                <div class="files-toolbar">
                    <button class="files-btn" id="new-folder">New Folder</button>
                    <button class="files-btn" id="refresh">Refresh</button>
                </div>
                <div class="files-list">
                    ${filesHTML}
                </div>
            </div>
        `;
    }

    attachEvents(window) {
        const content = window.querySelector('.window-content');
        // Add event listeners here
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const filesApp = new FilesApp();
