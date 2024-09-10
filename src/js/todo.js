import { addTodoToProject, getProjectTodos } from "./project"

let idCount = 0;
function createTodo(project, name, desc, dueDate, priority) {
  // generate unique id to access todo by later
  const id = idCount++;
  const todo = { id, complete: false, name, desc, dueDate, priority };
  addTodoToProject(project, todo);
}

function getTodo(project, id) {
  return getProjectTodos(project).find((todo) => todo.id == id);
}
function getTodoIndex(project, id) {
  return getProjectTodos(project).findIndex((todo) => todo.id == id);
}

function toggleTodoComplete(project, id) {
  const todo = getTodo(project, id);
  todo.complete = !todo.complete;
}

function editTodo(project, id, property, value) {
  getTodo(project, id)[property] = value;
}

function deleteTodo(project, id) {
  getProjectTodos(project).splice(getTodoIndex(project, id), 1);
}

function changeTodoProject(project, newProject, id) {
  const todo = getTodo(id);
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