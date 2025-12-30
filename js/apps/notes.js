// Notes App
class NotesApp {
    constructor() {
        this.notes = storage.get('notes', []);
        this.currentNoteId = null;
        this.windowId = 'notes';
    }

    open() {
        const content = this.render();
        const window = windowManager.createWindow(this.windowId, {
            title: 'Notes',
            width: 700,
            height: 600,
            class: 'app-notes',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                <path d="M14 2v6h6"></path>
            </svg>`,
            content: content
        });

        this.attachEvents(window);
        if (this.notes.length > 0) {
            this.loadNote(this.notes[0].id, window);
        }
    }

    render() {
        const notesListHtml = this.notes.map(note => `
            <div class="note-item ${note.id === this.currentNoteId ? 'active' : ''}" data-note-id="${note.id}">
                <div class="note-title">${this.escapeHtml(note.title || 'Untitled')}</div>
                <div class="note-preview">${this.escapeHtml(note.content?.substring(0, 100) || 'No content')}</div>
                <div class="note-meta">${this.formatDate(note.updatedAt || note.createdAt)}</div>
            </div>
        `).join('');

        return `
            <div class="notes-container">
                <div class="notes-header">
                    <h2>My Notes</h2>
                </div>
                <div class="notes-list" id="notes-list">
                    ${notesListHtml}
                </div>
                <div class="notes-editor" id="notes-editor">
                    <input type="text" class="note-editor-title" id="note-title" placeholder="Note title...">
                    <textarea class="note-editor-content" id="note-content" placeholder="Start writing..."></textarea>
                    <div class="notes-toolbar">
                        <button class="notes-btn" id="note-new-btn">New Note</button>
                        <button class="notes-btn primary" id="note-save-btn">Save</button>
                    </div>
                </div>
            </div>
        `;
    }

    attachEvents(window) {
        const content = window.querySelector('.window-content');
        const list = content.querySelector('#notes-list');
        const editor = content.querySelector('#notes-editor');
        const titleInput = content.querySelector('#note-title');
        const contentInput = content.querySelector('#note-content');
        const newBtn = content.querySelector('#note-new-btn');
        const saveBtn = content.querySelector('#note-save-btn');

        // Load note
        list.addEventListener('click', (e) => {
            const noteItem = e.target.closest('.note-item');
            if (!noteItem) return;

            const noteId = noteItem.dataset.noteId;
            this.loadNote(noteId, window);
        });

        // New note
        newBtn.addEventListener('click', () => {
            this.currentNoteId = null;
            titleInput.value = '';
            contentInput.value = '';
            this.refreshList(content);
            titleInput.focus();
        });

        // Save note
        saveBtn.addEventListener('click', () => {
            this.saveNote(titleInput.value.trim(), contentInput.value, window);
        });

        // Auto-save on content change (debounced)
        let saveTimeout;
        [titleInput, contentInput].forEach(input => {
            input.addEventListener('input', () => {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    if (this.currentNoteId) {
                        this.saveNote(titleInput.value.trim(), contentInput.value, window, false);
                    }
                }, 2000);
            });
        });
    }

    loadNote(noteId, window) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;

        this.currentNoteId = noteId;
        const content = window.querySelector('.window-content');
        const titleInput = content.querySelector('#note-title');
        const contentInput = content.querySelector('#note-content');

        titleInput.value = note.title || '';
        contentInput.value = note.content || '';
        this.refreshList(content);
    }

    saveNote(title, content, window, showFeedback = true) {
        if (!title && !content) return;

        if (this.currentNoteId) {
            // Update existing
            const note = this.notes.find(n => n.id === this.currentNoteId);
            if (note) {
                note.title = title || 'Untitled';
                note.content = content;
                note.updatedAt = Date.now();
            }
        } else {
            // Create new
            const newNote = {
                id: 'note_' + Date.now(),
                title: title || 'Untitled',
                content: content,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            this.notes.unshift(newNote);
            this.currentNoteId = newNote.id;
        }

        this.save();
        this.refreshList(window.querySelector('.window-content'));

        if (showFeedback) {
            const saveBtn = window.querySelector('#note-save-btn');
            const originalText = saveBtn.textContent;
            saveBtn.textContent = 'Saved!';
            saveBtn.style.background = 'rgba(34, 197, 94, 0.8)';
            setTimeout(() => {
                saveBtn.textContent = originalText;
                saveBtn.style.background = '';
            }, 1000);
        }
    }

    refreshList(container) {
        const list = container.querySelector('#notes-list');
        list.innerHTML = this.notes.map(note => `
            <div class="note-item ${note.id === this.currentNoteId ? 'active' : ''}" data-note-id="${note.id}">
                <div class="note-title">${this.escapeHtml(note.title || 'Untitled')}</div>
                <div class="note-preview">${this.escapeHtml(note.content?.substring(0, 100) || 'No content')}</div>
                <div class="note-meta">${this.formatDate(note.updatedAt || note.createdAt)}</div>
            </div>
        `).join('');
    }

    save() {
        storage.set('notes', this.notes);
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const notesApp = new NotesApp();

