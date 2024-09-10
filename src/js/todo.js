import { addTodoToProject, getProjectTodos } from "./project"

let idCount = 0;

function createTodo(project, name, desc, dueDate, priority) {
  // generate unique id to access todo by later
  const id = idCount++;
  const todo = { id, complete: false, name, desc, dueDate, priority };
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

function changeTodoProject(project, newProject, todo) {
  deleteTodo(project, todo);
  addTodoToProject(newProject, todo);
}

export {
  createTodo,
  toggleTodoComplete,
  editTodo,
  deleteTodo,
  changeTodoProject
}