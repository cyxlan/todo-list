import {
  addTodoToProject,
  getProjectTodos,
} from "./project"

function _generateTodo(todo, complete=false) {
  // prevent creating a todo with no name
  if (todo.name === '') {
    throw new Error(`To-do name cannot be empty.`);
  }
  return {
    complete,
    name: todo.name,
    desc: todo.desc,
    dueDate: todo.dueDate,
    priority: todo.priority
  };
}

function addTodo(todo) {
  addTodoToProject(todo.project, _generateTodo(todo));
}

function _getTodoIndex(project, todo) {
  return getProjectTodos(project).findIndex((x) => x === todo);
}

function toggleTodoComplete(todo) {
  todo.complete = !todo.complete;
}

function editTodo(project, oldTodo, newTodo) {
  // if the project changed, delete the todo from the current project and add it to the new one
  if (newTodo.project !== project) {
    deleteTodo(project, oldTodo);
    addTodo(newTodo, oldTodo.complete);
  // else, edit the todo in place
  } else {
    getProjectTodos(project)[_getTodoIndex(project, oldTodo)] = _generateTodo(newTodo, oldTodo.complete);
  }
}

function deleteTodo(project, todo) {
  getProjectTodos(project).splice(_getTodoIndex(project, todo), 1);
}

export {
  addTodo,
  toggleTodoComplete,
  editTodo,
  deleteTodo,
};