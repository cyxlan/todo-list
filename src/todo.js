import { addTodoToProject, getProjectTodos } from "./project"

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

function deleteTodo(project, todo) {
  const todos = getProjectTodos(project);
  const index = todos.indexOf(todo);
  todos.splice(index, 1);
}

export {
  createTodo,
  toggleTodoComplete,
  editTodo,
  deleteTodo
}