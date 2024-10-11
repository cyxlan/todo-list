import { getProjects } from "./project"

function populateStorage() {
  localStorage.setItem("projects", JSON.stringify(getProjects()));
}

function getStorage() {
  const projects = localStorage.getItem("projects");
  if (projects) {
    return JSON.parse(projects);
  } else {
    return false;
  }
}

export {
  populateStorage,
  getStorage,
}