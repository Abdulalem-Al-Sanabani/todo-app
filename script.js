const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const themeToggle = document.getElementById("theme-toggle");
const todoCount = document.getElementById("todo-count");
const root = document.documentElement;

const THEME_KEY = "todo-theme";
const LIGHT_THEME = "light";
const DARK_THEME = "dark";

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

  const icon = themeToggle.querySelector(".theme-icon");
  const label = themeToggle.querySelector(".theme-label");
  if (icon) icon.textContent = isDark ? "☀️" : "🌙";
  if (label) label.textContent = isDark ? "Light" : "Dark";

  themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  themeToggle.setAttribute("aria-pressed", String(isDark));
}

function updateCount() {
  const n = todos.length;
  if (n === 0) {
    todoCount.textContent = "No tasks yet";
  } else if (n === 1) {
    todoCount.textContent = "1 task";
  } else {
    todoCount.textContent = `${n} tasks`;
  }
}

function renderTodos() {
  list.innerHTML = "";
  updateCount();

  if (todos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    const icon = document.createElement("span");
    icon.className = "empty-state-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "📋";
    const msg = document.createTextNode("No todos yet. Add one above!");
    empty.appendChild(icon);
    empty.appendChild(msg);
    list.appendChild(empty);
    return;
  }

  todos.forEach((todo, index) => {
    const item = document.createElement("li");
    item.className = "todo-item";

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo;

    const delButton = document.createElement("button");
    delButton.className = "delete-btn";
    delButton.type = "button";
    delButton.textContent = "✕ Delete";
    delButton.setAttribute("aria-label", `Delete: ${todo}`);
    delButton.addEventListener("click", () => {
      item.classList.add("removing");
      item.addEventListener("animationend", () => {
        todos.splice(index, 1);
        renderTodos();
      }, { once: true });
    });

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

  todos.push(value);
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
