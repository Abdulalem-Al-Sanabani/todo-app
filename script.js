const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const themeToggle = document.getElementById("theme-toggle");
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
  themeToggle.textContent = isDark ? "Light Theme" : "Dark Theme";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  themeToggle.setAttribute("aria-pressed", String(isDark));
}

function renderTodos() {
  list.innerHTML = "";

  if (todos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "No todos yet. Add one above.";
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
    delButton.textContent = "Delete";
    delButton.addEventListener("click", () => {
      todos.splice(index, 1);
      renderTodos();
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
