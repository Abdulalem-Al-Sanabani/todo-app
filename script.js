const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const stats = document.getElementById("todo-stats");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const themeLabel = themeToggle.querySelector(".theme-label");
const root = document.documentElement;

const THEME_KEY = "todo-theme";
const LIGHT_THEME = "light";
const DARK_THEME = "dark";
const REMOVE_ANIMATION_MS = 250;

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
  themeIcon.textContent = isDark ? "☀️" : "🌙";
  themeLabel.textContent = isDark ? "Light" : "Dark";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  themeToggle.setAttribute("aria-pressed", String(isDark));
}

function updateStats() {
  const total = todos.length;
  if (total === 0) {
    stats.hidden = true;
    return;
  }

  const completed = todos.filter(t => t.completed).length;
  const remaining = total - completed;
  stats.hidden = false;

  if (completed === 0) {
    stats.textContent = `${total} task${total !== 1 ? "s" : ""}`;
  } else if (remaining === 0) {
    stats.textContent = `All ${total} done 🎉`;
  } else {
    stats.textContent = `${remaining} remaining · ${completed} completed`;
  }
}

function renderTodos() {
  list.innerHTML = "";

  if (todos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.innerHTML = `
      <span class="empty-state-icon" aria-hidden="true">📋</span>
      <p class="empty-state-text">No todos yet</p>
      <p class="empty-state-sub">Add one above to get started!</p>
    `;
    list.appendChild(empty);
    updateStats();
    return;
  }

  todos.forEach((todo, index) => {
    const item = document.createElement("li");
    item.className = `todo-item${todo.completed ? " completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `Mark "${todo.text}" as ${todo.completed ? "incomplete" : "complete"}`);
    checkbox.addEventListener("change", () => {
      todos[index].completed = checkbox.checked;
      item.classList.toggle("completed", checkbox.checked);
      updateStats();
    });

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const delButton = document.createElement("button");
    delButton.className = "delete-btn";
    delButton.type = "button";
    delButton.textContent = "✕";
    delButton.setAttribute("aria-label", `Delete "${todo.text}"`);
    delButton.addEventListener("click", () => {
      item.classList.add("removing");
      setTimeout(() => {
        todos.splice(index, 1);
        renderTodos();
      }, REMOVE_ANIMATION_MS);
    });

    item.appendChild(checkbox);
    item.appendChild(text);
    item.appendChild(delButton);
    list.appendChild(item);
  });

  updateStats();
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
