const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

let todos = [];

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

renderTodos();
