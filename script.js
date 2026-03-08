const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;

const THEME_KEY = "todo-theme";
const LIGHT_THEME = "light";
const DARK_THEME = "dark";

// Each todo: { text: string, completed: boolean }
let todos = [];

function getPreferredTheme() {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === LIGHT_THEME || storedTheme === DARK_THEME) {
    return storedTheme;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? DARK_THEME : LIGHT_THEME;
}

function applyTheme(theme) {
  const nextTheme = theme === DARK_THEME ? DARK_THEME : LIGHT_THEME;
  const isDark = nextTheme === DARK_THEME;

  root.setAttribute("data-theme", nextTheme);

  const iconEl = themeToggle.querySelector(".theme-toggle-icon");
  const labelEl = themeToggle.querySelector(".theme-toggle-label");

  if (iconEl) iconEl.textContent = isDark ? "☀️" : "🌙";
  if (labelEl) labelEl.textContent = isDark ? "Light" : "Dark";

  themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  themeToggle.setAttribute("aria-pressed", String(isDark));
}

function removeItemAnimated(item, index) {
  item.classList.add("removing");
  item.addEventListener("animationend", () => {
    todos.splice(index, 1);
    renderTodos();
  }, { once: true });
}

function renderTodos() {
  list.innerHTML = "";

  if (todos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.innerHTML = '<span class="empty-state-icon" aria-hidden="true">📋</span><span>No tasks yet — add one above!</span>';
    list.appendChild(empty);
    return;
  }

  todos.forEach((todo, index) => {
    const item = document.createElement("li");
    item.className = "todo-item" + (todo.completed ? " completed" : "");

    // Complete toggle button
    const completeBtn = document.createElement("button");
    completeBtn.className = "complete-btn";
    completeBtn.type = "button";
    completeBtn.setAttribute("aria-label", todo.completed ? "Mark as incomplete" : "Mark as complete");
    completeBtn.textContent = todo.completed ? "✓" : "";
    completeBtn.addEventListener("click", () => {
      todos[index].completed = !todos[index].completed;
      renderTodos();
    });

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const delButton = document.createElement("button");
    delButton.className = "delete-btn";
    delButton.type = "button";
    delButton.textContent = "Delete";
    delButton.setAttribute("aria-label", `Delete task: ${todo.text}`);
    delButton.addEventListener("click", () => {
      removeItemAnimated(item, index);
    });

    item.appendChild(completeBtn);
    item.appendChild(text);
    item.appendChild(delButton);
    list.appendChild(item);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const value = input.value.trim();
  if (!value) {
    return;
  }

  todos.push({ text: value, completed: false });
  input.value = "";
  input.focus();
  renderTodos();
});

themeToggle.addEventListener("click", () => {
  const currentTheme = root.getAttribute("data-theme") === DARK_THEME ? DARK_THEME : LIGHT_THEME;
  const nextTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
  applyTheme(nextTheme);
  localStorage.setItem(THEME_KEY, nextTheme);
});

applyTheme(getPreferredTheme());
renderTodos();

