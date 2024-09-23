import { DuplicateNameError, createProject, renameProject, deleteProject, getProjectNames, getProjectTodos } from "./project";
import { createTodo, toggleTodoComplete, deleteTodo } from "./todo";

import "../css/index.css";
import 'iconify-icon';
import 'pretty-checkbox';

const displayController = (function() {
  const contentDiv = document.querySelector("#content");
  const dialog = document.querySelector('#dialog');

  const updateDisplay = () => {
    const createProjectDiv = (projectName) => {
      const createTodoArticle = (projectName, todo) => {
        const todoArticle = document.createElement("article");
        todoArticle.classList.add("todo");

        const checkboxWrap = document.createElement('div');
        checkboxWrap.classList.add('pretty', 'p-svg', 'p-round', 'p-fill');

        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        if (todo.complete) {
          checkbox.checked = true;
        }
        checkbox.addEventListener("change", () => {
          toggleTodoComplete(todo);
        })
        const checkboxState = document.createElement('div');
        checkboxState.classList.add('state');

        const checkIcon = document.createElement("iconify-icon");
        checkIcon.setAttribute('icon', 'mdi:check');
        checkIcon.setAttribute('aria-hidden', 'true');
        checkIcon.classList.add('svg');

        const checkboxLabel = document.createElement('label');
        const checkboxLabelSpan = document.createElement('span');
        checkboxLabelSpan.textContent = "Complete to-do";
        checkboxLabelSpan.classList.add('sr-only');
        checkboxLabel.append(checkboxLabelSpan);

        checkboxState.append(checkIcon, checkboxLabel);
        checkboxWrap.append(checkbox, checkboxState);
        todoArticle.append(checkboxWrap);
    
        const todoInfo = document.createElement("div");
        todoInfo.classList.add("todo-info");
    
        const name = document.createElement("h3");
        name.textContent = todo.name;
        name.classList.add("todo-name");
    
        const dueDate = document.createElement("p");
        dueDate.textContent = todo.dueDate;
        dueDate.classList.add("todo-dueDate");
    
        const priority = document.createElement("p");
        priority.textContent = todo.priority;
        priority.classList.add("todo-priority");
        priority.classList.add(`priority-${todo.priority}`);

        const desc = document.createElement("p");
        desc.textContent = todo.desc;
        desc.classList.add("todo-desc");
    
        todoInfo.append(name, dueDate, priority, desc);
    
        const deleteBtn = document.createElement("button");
        deleteBtn.setAttribute("type", "button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "X";
        deleteBtn.addEventListener("click", () => {
          deleteTodo(projectName, todo);
          updateDisplay();
        })
    
        todoArticle.append(todoInfo, deleteBtn);

        // todoArticle.addEventListener('click', () => {
        //   todoDialog(projectName, todo);
        //   dialog.showModal();
        // })

        return todoArticle;
      }
      
      const projectDiv = document.createElement("div");
      projectDiv.classList.add("project");
  
      const projectHeader = document.createElement("h2");
      projectHeader.textContent = projectName;
      projectDiv.append(projectHeader);

      projectHeader.addEventListener('click', () => {
        renameProjectDialog(projectName);
        dialog.showModal();
      })

      const deleteBtn = document.createElement("button");
        deleteBtn.setAttribute("type", "button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "X";
        deleteBtn.addEventListener("click", () => {
          deleteProject(projectName);
          updateDisplay();
        })
      projectDiv.append(deleteBtn);
  
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
        todoDialog(projectName);
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
    newProjectBtn.id = "new-project-btn";
    const plusIcon = document.createElement("iconify-icon");
    plusIcon.setAttribute('icon', 'mdi:plus');
    plusIcon.setAttribute('aria-hidden', 'true');
    const span = document.createElement('span');
    span.textContent = "New Project";
    newProjectBtn.append(plusIcon, span);

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

  const renameProjectDialog = (oldName) => {
    const [dialogSubmit, nameInput] = generateDialogForm("Rename Project", "Project name");
    nameInput.value = oldName;

    dialogSubmit.addEventListener("click", (e) => {
      submitForm(e, () => { renameProject(oldName, nameInput.value) })
    });
  }
    
  const generateTodoForm = (currentProject, headerText) => {
    const [dialogSubmit, nameInput] = generateDialogForm(headerText, "To-do name");

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

    const dateInputLabel = document.createElement('label');
    dateInputLabel.textContent = "Due date";
    dateInputLabel.setAttribute("for", "date-input");

    const dateInput = document.createElement('input');
    dateInput.setAttribute("type", "date");
    dateInput.id = "date-input";

    const prioritySelectLabel = document.createElement('label');
    prioritySelectLabel.textContent = "Priority";
    prioritySelectLabel.setAttribute("for", "priority-select");

    const prioritySelect = document.createElement('select');
    prioritySelect.id = "priority-select";
    for (const priority of ["Low", "Medium", "High"]) {
      const option = new Option(priority, priority);
      prioritySelect.append(option);
    }

    const descInputLabel = document.createElement('label');
    descInputLabel.textContent = "Description";
    descInputLabel.setAttribute("for", "desc-input");

    const descInput = document.createElement('textarea');
    descInput.id = "desc-input";

    nameInput.after(projectSelectLabel, projectSelect, dateInputLabel, dateInput, prioritySelectLabel, prioritySelect, descInputLabel, descInput);

    return { nameInput, projectSelect, dateInput, prioritySelect, descInput, dialogSubmit }; 
  }

  const todoDialog = (projectName, todo) => {
    let todoForm;
    // if editing an todo, fill in the fields with the existing values
    if (todo) {
      todoForm = generateTodoForm(projectName, "Edit To-Do");

      todoForm.nameInput.value = todo.name;
      todoForm.dateInput.value = todo.dueDate;
      todoForm.prioritySelect.value = todo.priority;
      todoForm.descInput.value = todo.desc;
    } else {
      todoForm = generateTodoForm(projectName, "New To-Do");
    }

    todoForm.dialogSubmit.addEventListener("click", (e) => {
      // if editing an todo, delete the old todo before creating a new one
      if (todo) {
        deleteTodo(projectName, todo);
      };
      submitForm(e, () => { 
        createTodo(
          todoForm.projectSelect.value,
          todoForm.nameInput.value,
          todoForm.descInput.value,
          todoForm.dateInput.value,
          todoForm.prioritySelect.value)
      });
    });
  }

  const submitForm = (e, createFunction) => {
    try {
      createFunction();
      updateDisplay();
    } catch (error) {
      // prevent refresh after alert dismissed
      e.preventDefault();
      alert(error.message);
      // if error was duplicate project name, clear name input
      if (error instanceof DuplicateNameError) {
        document.querySelector('#name-input').value = "";
      }
    }
  }

  // test data
  createProject("project 2");
  createTodo("default", "task 1", "", "2024-09-08", "Low");
  createTodo("default", "task 2", "Lorem ipsum odor amet, consectetuer adipiscing elit. Habitasse posuere sociosqu eget lobortis feugiat odio nam nam. Sed ex velit ante nec fames dolor.", "2024-09-08", "Medium");
  createTodo("default", "task 3", "", "2024-09-08", "High");

  updateDisplay();
})();