import { createProject, renameProject, deleteProject, getProjectNames, getProjectTodos } from "./project";
import { createTodo, toggleTodoComplete, editTodo, deleteTodo, changeTodoProject } from "./todo";

import "../css/index.css";

const displayController = (function() {
  const contentDiv = document.querySelector("#content");
  const dialog = document.querySelector('#dialog');

  const createTodoArticle = (projectName, todo) => {
    const todoArticle = document.createElement("article");
    todoArticle.classList.add("todo");

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    if (todo.complete) {
      checkbox.checked = true;
    }
    checkbox.addEventListener("change", () => {
      toggleTodoComplete(todo);
    })
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

    const deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("type", "button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "X";
    deleteBtn.addEventListener("click", () => {
      deleteTodo(projectName, todo);
      updateDisplay();
    })

    todoArticle.append(todoInfo, deleteBtn);
    return todoArticle;
  }

  const updateDisplay = () => {
    contentDiv.textContent = "";

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
          projectDiv.append(createTodoArticle(projectName, todo));
        }
      }

      const newTodoBtn = document.createElement("button");
      newTodoBtn.setAttribute("type", "button");
      newTodoBtn.classList.add("new-todo-btn");
      newTodoBtn.textContent = "New to-do";
      projectDiv.append(newTodoBtn);

      contentDiv.append(projectDiv);
    }

    const newProjectBtn = document.createElement("button");
    newProjectBtn.setAttribute("type", "button");
    newProjectBtn.textContent = "New project";

    newProjectBtn.addEventListener("click", () => {
      newProjectDialog();
      dialog.showModal();
    })

    contentDiv.append(newProjectBtn);
  }

  const newProjectDialog = () => {
    const dialogHeader = document.querySelector('#dialog h2');
    dialogHeader.textContent = "New Project";

    const nameInputLabel = document.querySelector('#dialog label[for="form-name"]');
    nameInputLabel.textContent = "Project name";

    const nameInput = document.querySelector('#form-name');
    nameInput.value = "";

    const dialogSubmit = document.querySelector('#submit-btn');
    dialogSubmit.addEventListener("click", submitNewProject);

    const dialogCancel = document.querySelector('#cancel-btn');
    dialogCancel.addEventListener("click", () => {
      dialog.close();
    })
  }

  const submitNewProject = (e) => {
    const nameInput = document.querySelector('#form-name');
    const projectName = nameInput.value;
    try {
      createProject(projectName);
      updateDisplay();
    } catch (error) {
      // prevent refresh after alert dismissed
      e.preventDefault();
      alert(error);
      nameInput.value = "";
    }
  }

  // test data
  createProject("project 2");
  createTodo("default", "task 1", "description", "09/08/24", "priority");
  createTodo("default", "task 2", "description", "09/08/24", "priority");

  updateDisplay();
})();