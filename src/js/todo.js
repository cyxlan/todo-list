import { addTodoToProject, getProjectTodos } from "./project"

function createTodo(project, name, desc, dueDate, priority) {
  const todo = { complete: false, name, desc, dueDate, priority };
  addTodoToProject(project, todo);
}

function getTodoIndex(project, todo) {
  return getProjectTodos(project).findIndex((x) => x === todo);
}

function toggleTodoComplete(todo) {
  todo.complete = !todo.complete;
}

function editTodo(todo, property, value) {
  todo[property] = value;
}

function deleteTodo(project, todo) {
  getProjectTodos(project).splice(getTodoIndex(project, todo), 1);
}

function changeTodoProject(todo, project, newProject) {
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