import { addTodoToProject } from "./project"

function createTodo(project, name, desc, dueDate, priority) {
  const todo = { complete: false, name, desc, dueDate, priority };
  addTodoToProject(project, todo);
}

function toggleTodoComplete(todo) {
  todo.complete = !todo.complete;
}

export {
  createTodo,
  toggleTodoComplete
}