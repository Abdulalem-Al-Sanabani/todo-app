// DOM elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const tasksList = document.getElementById('tasks');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Current filter state: 'all', 'pending', 'completed'
let currentFilter = 'all';

// Dark mode state
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Render tasks
function renderTasks() {
    tasksList.innerHTML = '';
    tasks.forEach((task, index) => {
        if (currentFilter === 'pending' && task.completed) return;
        if (currentFilter === 'completed' && !task.completed) return;

        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-index="${index}" aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}">
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="btn-delete" data-index="${index}" aria-label="Delete task">Delete</button>
            </div>
        `;

        tasksList.appendChild(li);
    });
}

// Add task
function addTask(text) {
    const task = {
        text: text,
        completed: false,
        id: Date.now()
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
}

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Toggle task completion
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Event listeners
const filterAllBtn = document.getElementById('filter-all');
const filterPendingBtn = document.getElementById('filter-pending');
const filterCompletedBtn = document.getElementById('filter-completed');

filterAllBtn.addEventListener('click', () => setFilter('all'));
filterPendingBtn.addEventListener('click', () => setFilter('pending'));
filterCompletedBtn.addEventListener('click', () => setFilter('completed'));

darkModeToggle.addEventListener('click', toggleDarkMode);

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text.length === 0) {
        taskInput.value = '';
        taskInput.focus();
        return;
    }
    addTask(text);
});

tasksList.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        const index = parseInt(e.target.dataset.index);
        deleteTask(index);
    } else if (e.target.classList.contains('task-checkbox')) {
        const index = parseInt(e.target.dataset.index);
        toggleTask(index);
    }
});

// Keyboard navigation
tasksList.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (e.target.classList.contains('btn-delete')) {
            const index = parseInt(e.target.dataset.index);
            deleteTask(index);
        } else if (e.target.classList.contains('task-checkbox')) {
            const index = parseInt(e.target.dataset.index);
            toggleTask(index);
        }
    }
});

// Filter handling
function setFilter(filter) {
    currentFilter = filter;
    // update active button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (filter === 'all') filterAllBtn.classList.add('active');
    if (filter === 'pending') filterPendingBtn.classList.add('active');
    if (filter === 'completed') filterCompletedBtn.classList.add('active');
    renderTasks();
}

// Dark mode functions
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
    updateToggleIcon();
}

function updateToggleIcon() {
    const icon = darkModeToggle.querySelector('.toggle-icon');
    icon.textContent = isDarkMode ? '☀️' : '🌙';
}

// Initialize
document.body.classList.toggle('dark-mode', isDarkMode);
updateToggleIcon();
renderTasks();