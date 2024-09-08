import { addTodoToProject } from "./project"

function createTodo(project, name, desc, dueDate, priority) {
  const todo = { complete: false, name, desc, dueDate, priority };
  addTodoToProject(project, todo);
}

function toggleTodoComplete(todo) {
  todo.complete = !todo.complete;
}

function editTodo(todo, property, value) {
  todo[property] = value;
}

export {
  createTodo,
  toggleTodoComplete,
  editTodo
}