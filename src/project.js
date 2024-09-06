const projects = [];

const createProject = (name) => {
  const project = { name, todos: [] };
  projects.push(project);
}
createProject("default");

const getProject = (name) => {
  for (const project of projects) {
    if (project.name === name) {
      return project;
    }
  }
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
  getProjectNames,
  getProjectTodos,
  addTodoToProject
}
