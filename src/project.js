const projects = [];

const getProject = (name) => {
  for (const project of projects) {
    if (project.name === name) {
      return project;
    }
  }
}

const createProject = (name) => {
  // prevent creating a project with the same name as one that already exists
  if (getProject(name)) {
    throw new Error(`Project named "${name}" already exists.`);
  } else {
    const project = { name, todos: [] };
    projects.push(project);
  }
}
createProject("default");

const renameProject = (name, newName) => {
  getProject(name).name = newName;
}

const getProjectNames = () => {
  const projectNames = []
  for (const project of projects) {
    projectNames.push(project.name);
  }
  return projectNames;
};

const getProjectTodos = (projectName) => {
  return getProject(projectName).todos;
}

const addTodoToProject = (projectName, todo) => {
  getProject(projectName).todos.push(todo);
}

export {
  createProject,
  renameProject,
  getProjectNames,
  getProjectTodos,
  addTodoToProject
}
