const projects = [];

const _getProject = (name) => {
  return projects.find((x) => x.name === name);
};

class DuplicateNameError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}
const createProject = (name) => {
  // prevent creating a project with no name or the same name as one that already exists
  if (name === '') {
    throw new Error(`Project name cannot be empty.`);
  } else if (_getProject(name)) {
    throw new DuplicateNameError(`Project named "${name}" already exists.`);
  }
  const project = { name, todos: [] };
  projects.push(project);
};

const renameProject = (name, newName) => {
  _getProject(name).name = newName;
};

const deleteProject = (name) => {
  const index = projects.indexOf(_getProject(name));
  projects.splice(index, 1);
};

const getProjectNames = () => {
  return projects.map((x) => x.name);
};

const getProjectTodos = (projectName) => {
  return _getProject(projectName).todos;
};

// get number of completed todos and total number of todos
const getProjectProgress = (projectName) => {
  const todos = _getProject(projectName).todos;
  return [todos.filter((todo) => todo.complete).length, todos.length];
};

const addTodoToProject = (projectName, todo) => {
  _getProject(projectName).todos.push(todo);
};

export {
  DuplicateNameError,
  createProject,
  renameProject,
  deleteProject,
  getProjectNames,
  getProjectTodos,
  getProjectProgress,
  addTodoToProject,
};
