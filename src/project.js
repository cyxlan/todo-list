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

const getProjects = () => projects;

export {
  createProject,
  getProject,
  getProjects,
}
