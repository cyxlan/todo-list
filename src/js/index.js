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
    const createProjectDiv = (projectName) => {
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
  
      newTodoBtn.addEventListener("click", () => {
        newTodoDialog(projectName);
        dialog.showModal();
      })
  
      projectDiv.append(newTodoBtn);

      return projectDiv;
    }

    contentDiv.textContent = "";

    for (const projectName of getProjectNames()) {
      contentDiv.append(createProjectDiv(projectName));
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

  const generateDialogForm = (headerText, nameLabelText) => {
    const dialogForm = document.querySelector('#dialog-form');
    dialogForm.textContent = "";

    const dialogHeader = document.createElement('h2');
    dialogHeader.textContent = headerText;

    const nameInputLabel = document.createElement('label');
    nameInputLabel.setAttribute("for", "name-input");
    nameInputLabel.textContent = nameLabelText;

    const nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('autofocus', 'autofocus');
    nameInput.id = "name-input";

    const dialogSubmit = document.createElement('button');
    dialogSubmit.setAttribute('type', 'submit');
    dialogSubmit.id = "submit-btn";
    dialogSubmit.textContent = "Submit";

    const dialogCancel = document.createElement('button');
    dialogCancel.setAttribute('type', 'button');
    dialogCancel.id = "cancel-btn";
    dialogCancel.textContent = "Cancel";

    dialogCancel.addEventListener("click", () => {
      dialog.close();
    })

    dialogForm.append(dialogHeader, nameInputLabel, nameInput, dialogSubmit, dialogCancel);

    return [dialogSubmit, nameInput];
  }

  const newProjectDialog = () => {
    const [dialogSubmit, nameInput] = generateDialogForm("New Project", "Project name");

    dialogSubmit.addEventListener("click", (e) => {
      submitForm(e, () => { createProject(nameInput.value) })
    });
  }
    
  const newTodoDialog = (currentProject) => {
    const [dialogSubmit, nameInput] = generateDialogForm("New To-Do", "To-do name");

    const projectSelectLabel = document.createElement('label');
    projectSelectLabel.textContent = "Project";
    projectSelectLabel.setAttribute("for", "project-select");

    const projectSelect = document.createElement('select');
    projectSelect.id = "project-select";
    for (const projectName of getProjectNames()) {
      const option = new Option(projectName, projectName);
      // if this dialog was triggered from a project, set that project to be selected by default
      if (projectName === currentProject) {
        option.setAttribute("selected", "true");
      }
      projectSelect.append(option);
    }

    const descInputLabel = document.createElement('label');
    descInputLabel.textContent = "Description";
    descInputLabel.setAttribute("for", "desc-input");

    const descInput = document.createElement('textarea');
    descInput.id = "desc-input";

    nameInput.after(projectSelectLabel, projectSelect, descInputLabel, descInput);

    dialogSubmit.addEventListener("click", (e) => {
      submitForm(e, () => { createTodo(projectSelect.value, nameInput.value, descInput.value) })
    });
  }

  const submitForm = (e, createFunction) => {
    const nameInput = document.querySelector('#name-input');
    try {
      createFunction();
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