import { addTodoToProject, getProjectTodos } from "./project"

function createTodo(project, name, desc="", dueDate="", priority="") {
  // prevent creating a todo with no name
  if (name === "") {
    throw new Error(`To-do name cannot be empty.`);
  }
  const todo = { complete: false, name, desc, dueDate, priority };
  addTodoToProject(project, todo);
}

function getTodoIndex(project, todo) {
  return getProjectTodos(project).findIndex((x) => x === todo);
}

function toggleTodoComplete(todo) {
  todo.complete = !todo.complete;
}

function deleteTodo(project, todo) {
  getProjectTodos(project).splice(getTodoIndex(project, todo), 1);
}

export {
  createTodo,
  toggleTodoComplete,
  deleteTodo,
}