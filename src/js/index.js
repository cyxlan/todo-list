import { createProject, renameProject, deleteProject, getProjectNames, getProjectTodos } from "./project";
import { createTodo, toggleTodoComplete, editTodo, deleteTodo, changeTodoProject } from "./todo";

import "../css/index.css";

const displayController = (function() {
  const contentDiv = document.querySelector("#content");

  const updateDisplay = () => {
    for (const projectName of getProjectNames()) {
      const projectDiv = document.createElement("div");
      const projectHeader = document.createElement("h2");

      projectHeader.textContent = projectName;
      projectDiv.append(projectHeader);

      const todos = getProjectTodos(projectName);
      if (todos.length === 0) {
        const noTasksNote = document.createElement("p");
        noTasksNote.textContent = "No tasks yet";
        projectDiv.append(noTasksNote);
      } else {
        for (const todo of todos) {
          const todoArticle = document.createElement("article");

          for (const property in todo) {
            const p = document.createElement("p");
            p.textContent = todo[property];
            todoArticle.append(p);
          }
          projectDiv.append(todoArticle);
        }
      }
      contentDiv.append(projectDiv);
    }
  }

  updateDisplay();
})();