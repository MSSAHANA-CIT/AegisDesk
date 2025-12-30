// Tasks App
class TasksApp {
    constructor() {
        this.tasks = storage.get('tasks', []);
        this.windowId = 'tasks';
    }

    open() {
        const content = this.render();
        const window = windowManager.createWindow(this.windowId, {
            title: 'Tasks',
            width: 500,
            height: 600,
            class: 'app-tasks',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
            </svg>`,
            content: content
        });

        this.attachEvents(window);
    }

    render() {
        return `
            <div class="tasks-container">
                <div class="tasks-header">
                    <h2>My Tasks</h2>
                </div>
                <div class="tasks-input-container">
                    <input type="text" class="tasks-input" id="task-input" placeholder="Add a new task...">
                    <button class="tasks-add-btn" id="task-add-btn">Add</button>
                </div>
                <div class="tasks-list" id="tasks-list">
                    ${this.tasks.length === 0 ? this.renderEmpty() : this.renderTasks()}
                </div>
            </div>
        `;
    }

    renderEmpty() {
        return `
            <div class="tasks-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                </svg>
                <p>No tasks yet. Add one to get started!</p>
            </div>
        `;
    }

    renderTasks() {
        return this.tasks.map((task, index) => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-index="${index}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-action="toggle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <div class="task-text">${this.escapeHtml(task.text)}</div>
                <button class="task-delete" data-action="delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    attachEvents(window) {
        const content = window.querySelector('.window-content');
        const input = content.querySelector('#task-input');
        const addBtn = content.querySelector('#task-add-btn');
        const list = content.querySelector('#tasks-list');

        // Add task
        const addTask = () => {
            const text = input.value.trim();
            if (!text) return;

            this.tasks.push({
                text: text,
                completed: false,
                createdAt: Date.now()
            });

            this.save();
            this.refresh(content);
            input.value = '';
            input.focus();
        };

        addBtn.addEventListener('click', addTask);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });

        // Task actions
        list.addEventListener('click', (e) => {
            const taskItem = e.target.closest('.task-item');
            if (!taskItem) return;

            const index = parseInt(taskItem.dataset.taskIndex);
            const action = e.target.closest('[data-action]')?.dataset.action;

            if (action === 'toggle') {
                this.tasks[index].completed = !this.tasks[index].completed;
                this.save();
                this.refresh(content);
            } else if (action === 'delete') {
                this.tasks.splice(index, 1);
                this.save();
                this.refresh(content);
            }
        });
    }

    refresh(container) {
        const list = container.querySelector('#tasks-list');
        list.innerHTML = this.tasks.length === 0 ? this.renderEmpty() : this.renderTasks();
    }

    save() {
        storage.set('tasks', this.tasks);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const tasksApp = new TasksApp();

