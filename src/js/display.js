import {
  deleteProject,
  getProjectNames,
  getProjectTodos,
  getProjectProgress
} from './project';
import {
  toggleTodoComplete,
  deleteTodo
} from './todo';
import {
  newProjectDialog,
  renameProjectDialog,
  todoDialog
} from './dialog';

import 'iconify-icon';
import 'pretty-checkbox';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const dialog = document.querySelector('#dialog');

tippy.setDefaultProps({
  trigger: 'click',
  arrow: false,
  placement: 'right',
  allowHTML: true,
  interactive: true,
});

const createIcon = (iconName) => {
  const icon = document.createElement('iconify-icon');
  icon.setAttribute('icon', `mdi:${iconName}`);
  icon.setAttribute('aria-hidden', 'true');
  return icon;
};

const createTodoArticle = (projectName, todo) => {
  const todoArticle = document.createElement('article');
  todoArticle.classList.add('todo');

  const menuDiv = document.createElement('div');
  menuDiv.classList.add('menu-container');

  const menuBtn = document.createElement('button');
  menuBtn.setAttribute('type', 'button');
  menuBtn.classList.add('menu-btn');
  menuBtn.ariaLabel = 'To-do options';

  const menuIcon = createIcon('dots-vertical');

  menuBtn.append(menuIcon);
  menuDiv.append(menuBtn);

  const todoMenuEdit = () => {
    todoDialog(projectName, todo);
    dialog.showModal();
  };
  const todoMenuDelete = () => {
    deleteTodo(projectName, todo);
    updateDisplay();
  };

  tippy(menuBtn, {
    content: `
      <div class="menu-popup">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>`,
    // align to todo container
    popperOptions: {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [3, 3],
          },
        },
      ],
    },
    onShown() {
      menuDiv
        .querySelector('.edit-btn')
        .addEventListener('click', todoMenuEdit);
      menuDiv
        .querySelector('.delete-btn')
        .addEventListener('click', todoMenuDelete);
    },
    onHide() {
      menuDiv
        .querySelector('.edit-btn')
        .removeEventListener('click', todoMenuEdit);
      menuDiv
        .querySelector('.delete-btn')
        .removeEventListener('click', todoMenuDelete);
    },
  });

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
  dueDate.textContent = dayjs(todo.dueDate).fromNow();
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
};

const createProjectDiv = (projectName) => {
  const projectDiv = document.createElement('div');
  projectDiv.classList.add('project');

  const projectHeader = document.createElement('h2');
  projectHeader.textContent = projectName;
  projectDiv.append(projectHeader);

  const menuDiv = document.createElement('div');
  menuDiv.classList.add('menu-container');

  const menuBtn = document.createElement('button');
  menuBtn.setAttribute('type', 'button');
  menuBtn.classList.add('menu-btn');
  menuBtn.ariaLabel = 'Project options';

  const menuIcon = createIcon('dots-vertical');

  menuBtn.append(menuIcon);
  menuDiv.append(menuBtn);

  const projectMenuRename = () => {
    renameProjectDialog(projectName);
    dialog.showModal();
  };
  const projectMenuDelete = () => {
    deleteProject(projectName);
    updateDisplay();
  };

  tippy(menuBtn, {
    content: `
      <div class="menu-popup">
        <button class="rename-btn">Rename</button>
        <button class="delete-btn">Delete</button>
      </div>`,
    // align to project container
    popperOptions: {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 5],
          },
        },
      ],
    },
    onShown() {
      menuDiv
        .querySelector('.rename-btn')
        .addEventListener('click', projectMenuRename);
      menuDiv
        .querySelector('.delete-btn')
        .addEventListener('click', projectMenuDelete);
    },
    onHide() {
      menuDiv
        .querySelector('.rename-btn')
        .removeEventListener('click', projectMenuRename);
      menuDiv
        .querySelector('.delete-btn')
        .removeEventListener('click', projectMenuDelete);
    },
  });

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
      projectDiv.append(createTodoArticle(projectName, todo));
    }
  }

  const newTodoBtn = document.createElement('button');
  newTodoBtn.setAttribute('type', 'button');
  newTodoBtn.classList.add('new-todo-btn');
  newTodoBtn.title = 'New to-do';
  newTodoBtn.ariaLabel = 'New to-do';

  const plusIcon = createIcon('plus');
  newTodoBtn.append(plusIcon);

  newTodoBtn.addEventListener('click', () => {
    todoDialog(projectName);
    dialog.showModal();
  });

  projectDiv.append(newTodoBtn);

  return projectDiv;
};

const updateDisplay = () => {
  const contentDiv = document.querySelector('#content');
  contentDiv.textContent = '';

  for (const projectName of getProjectNames()) {
    contentDiv.append(createProjectDiv(projectName));
  }

  const newProjectBtn = document.createElement('button');
  newProjectBtn.setAttribute('type', 'button');
  newProjectBtn.id = 'new-project-btn';

  const plusIcon = createIcon('plus');

  const span = document.createElement('span');
  span.textContent = 'New Project';

  newProjectBtn.append(plusIcon, span);

  newProjectBtn.addEventListener('click', () => {
    newProjectDialog();
    dialog.showModal();
  });

  contentDiv.append(newProjectBtn);
};

export {
  updateDisplay,
}
