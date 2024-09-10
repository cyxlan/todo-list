import { createProject, renameProject, deleteProject, getProjectNames, getProjectTodos } from "./project";
import { createTodo, toggleTodoComplete, editTodo, deleteTodo, changeTodoProject } from "./todo";

import "../css/index.css";

const displayController = (function() {
  const contentDiv = document.querySelector("#content");

  const updateDisplay = () => {
    for (const projectName of getProjectNames()) {
      const projectDiv = document.createElement("div");
      projectDiv.classList.add("project");
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
          todoArticle.classList.add("todo");
          todoArticle.dataset.id = todo.id;
          const todoInfo = document.createElement("div");
          todoInfo.classList.add("todo-info");

          for (const property in todo) {
            if (property === "id") {
              continue;
            }
            else if (property === "complete") {
              const checkbox = document.createElement("input");
              checkbox.setAttribute("type", "checkbox");
              todoArticle.append(checkbox);
            } else {
              let el;
              if (property === "name") {
                el = document.createElement("h3");
              } else {
                el = document.createElement("p");
              }
              el.textContent = todo[property];
              el.classList.add(`todo-${property}`);
              todoInfo.append(el);
            }
          }
          todoArticle.append(todoInfo);
          projectDiv.append(todoArticle);
        }
      }
      contentDiv.append(projectDiv);
    }
  }

  // test data
  createProject("project 2");
  createProject("project 3");
  createTodo("default", "task 1", "description", "09/08/24", "priority");

  updateDisplay();
})();