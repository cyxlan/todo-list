import {
  getProjectNames,
  getProjectTodos,
  getProjectProgress,
} from './project';
import { toggleTodoComplete } from './todo';
import {
  createProjectMenu,
  createTodoMenu
} from './popup';
import {
  newProjectDialog,
  todoDialog
} from './dialog';

import 'iconify-icon';
import 'pretty-checkbox';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

function createIcon(iconName) {
  const icon = document.createElement('iconify-icon');
  icon.setAttribute('icon', `mdi:${iconName}`);
  icon.setAttribute('aria-hidden', 'true');
  return icon;
}

function _showDialogOnClick(btn, dialogFunction) {
  const dialog = document.querySelector('#dialog');
  btn.addEventListener('click', () => {
    dialogFunction();
    dialog.showModal();
  });
}

function _createTodoArticle(projectName, todo) {
  const todoArticle = document.createElement('article');
  todoArticle.classList.add('todo');

  const menuDiv = createTodoMenu(projectName, todo);

  const checkboxWrap = document.createElement('div');
  checkboxWrap.classList.add('pretty', 'p-svg', 'p-round', 'p-fill');

  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.ariaLabel = 'Complete to-do';
  if (todo.complete) {
    checkbox.checked = true;
    todoArticle.classList.add('complete');
  }
  checkbox.addEventListener('change', () => {
    toggleTodoComplete(todo);
    todoArticle.classList.toggle('complete');
    updateDisplay();
  });

  const checkboxState = document.createElement('div');
  checkboxState.classList.add('state');

  const checkIcon = createIcon('check');
  checkIcon.classList.add('svg');

  const checkboxLabel = document.createElement('label');

  checkboxState.append(checkIcon, checkboxLabel);
  checkboxWrap.append(checkbox, checkboxState);

  const todoInfo = document.createElement('div');
  todoInfo.classList.add('todo-info');

  const name = document.createElement('h3');
  name.textContent = todo.name;
  name.classList.add('todo-name');

  const dueDate = document.createElement('p');
  if (todo.dueDate) {
    dueDate.textContent = dayjs(todo.dueDate).fromNow();
  }  
  dueDate.classList.add('todo-dueDate');

  const priority = document.createElement('p');
  priority.textContent = todo.priority;
  priority.classList.add('todo-priority', `priority-${todo.priority}`);

  const desc = document.createElement('p');
  desc.textContent = todo.desc;
  desc.classList.add('todo-desc');

  todoInfo.append(name, dueDate, priority, desc);
  todoArticle.append(menuDiv, checkboxWrap, todoInfo);

  return todoArticle;
}

function _createProjectDiv(projectName) {
  const projectDiv = document.createElement('div');
  projectDiv.classList.add('project');

  const projectHeader = document.createElement('h2');
  projectHeader.textContent = projectName;
  projectDiv.append(projectHeader);

  const menuDiv = createProjectMenu(projectName);

  projectDiv.append(menuDiv);

  const todos = getProjectTodos(projectName);
  if (todos.length === 0) {
    const noTodosNote = document.createElement('p');
    noTodosNote.textContent = 'No to-dos yet. Add one with the + button.';
    noTodosNote.classList.add('no-todos');
    projectDiv.append(noTodosNote);
  } else {
    // add todo progress count to header
    const [numCompleteTodos, numTotalTodos] = getProjectProgress(projectName);
    const projectProgress = document.createElement('span');
    projectProgress.classList.add('progress');
    projectProgress.textContent = `(${numCompleteTodos}/${numTotalTodos})`;
    projectHeader.append(projectProgress);

    for (const todo of todos) {
      projectDiv.append(_createTodoArticle(projectName, todo));
    }
  }

  const newTodoBtn = document.createElement('button');
  newTodoBtn.setAttribute('type', 'button');
  newTodoBtn.classList.add('new-project-todo-btn');
  newTodoBtn.title = 'Add to-do';
  newTodoBtn.ariaLabel = 'Add to-do to project';

  newTodoBtn.append(createIcon('plus'));

  _showDialogOnClick(newTodoBtn, () => {
    todoDialog(projectName);
  });

  projectDiv.append(newTodoBtn);

  return projectDiv;
}

function _createNewProjectBtn() {
  const newProjectBtn = document.createElement('button');
  newProjectBtn.setAttribute('type', 'button');
  newProjectBtn.id = 'new-project-btn';

  const span = document.createElement('span');
  span.textContent = 'New Project';

  newProjectBtn.append(createIcon('plus'), span);

  _showDialogOnClick(newProjectBtn, newProjectDialog);

  return newProjectBtn;
}

function _createNewTodoBtn() {
  const newTodoBtn = document.createElement('button');
  newTodoBtn.setAttribute('type', 'button');
  newTodoBtn.id = 'new-todo-btn';
  newTodoBtn.title = 'Add to-do';
  newTodoBtn.ariaLabel = 'Add to-do';

  newTodoBtn.append(createIcon('plus'));

  _showDialogOnClick(newTodoBtn, todoDialog);

  return newTodoBtn;
}

function updateDisplay() {
  const contentDiv = document.querySelector('#content');
  contentDiv.textContent = '';

  for (const projectName of getProjectNames()) {
    contentDiv.append(_createProjectDiv(projectName));
  }

  contentDiv.append(_createNewProjectBtn(), _createNewTodoBtn());
}

export {
  createIcon,
  updateDisplay,
};
