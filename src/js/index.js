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

          const checkbox = document.createElement("input");
          checkbox.setAttribute("type", "checkbox");
          todoArticle.append(checkbox);

          const todoInfo = document.createElement("div");
          todoInfo.classList.add("todo-info");

          const name = document.createElement("h3");
          name.textContent = todo.name;
          name.classList.add("todo-name");

          const desc = document.createElement("p");
          desc.textContent = todo.desc;
          desc.classList.add("todo-desc");

          const dueDate = document.createElement("p");
          dueDate.textContent = todo.dueDate;
          dueDate.classList.add("todo-dueDate");

          const priority = document.createElement("p");
          priority.textContent = todo.priority;
          priority.classList.add("todo-priority");

          todoInfo.append(name, desc, dueDate, priority);

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