let projects = [];

function getProjects() {
  return projects;
}

function setProjects(projectsData) {
  projects = projectsData;
}

function _getProject(name) {
  return projects.find((x) => x.name === name);
}

class DuplicateNameError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}
// prevent creating a project with no name or the same name as one that already exists
function _validateName(name) {
  if (name === '') {
    throw new Error(`Project name cannot be empty.`);
  } else if (_getProject(name)) {
    throw new DuplicateNameError(`Project named "${name}" already exists.`);
  }
}

function createProject(name) {
  _validateName(name);
  const project = { name, todos: [] };
  projects.push(project);
}

function renameProject(oldName, newName) {
  if (newName !== oldName) {
    _validateName(newName);
    _getProject(oldName).name = newName;
  }
}

function deleteProject(name) {
  const index = projects.indexOf(_getProject(name));
  projects.splice(index, 1);
}

function getProjectNames() {
  return projects.map((x) => x.name);
}

function getProjectTodos(projectName) {
  return _getProject(projectName).todos;
}

// get number of completed todos and total number of todos
function getProjectProgress(projectName) {
  const todos = _getProject(projectName).todos;
  return [todos.filter((todo) => todo.complete).length, todos.length];
}

function addTodoToProject(projectName, todo) {
  _getProject(projectName).todos.push(todo);
}

export {
  getProjects,
  setProjects,
  DuplicateNameError,
  createProject,
  renameProject,
  deleteProject,
  getProjectNames,
  getProjectTodos,
  getProjectProgress,
  addTodoToProject,
};
