import { deleteTodo } from './todo';
import { deleteProject } from './project';
import {
  renameProjectDialog,
  todoDialog
} from './dialog';
import {
  createIcon,
  updateDisplay
} from './display';

import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

tippy.setDefaultProps({
  trigger: 'click',
  arrow: false,
  placement: 'right',
  allowHTML: true,
  interactive: true,
});

const createProjectMenu = (projectName) => {
  const menuDiv = document.createElement('div');
  menuDiv.classList.add('menu-container');

  const menuBtn = document.createElement('button');
  menuBtn.setAttribute('type', 'button');
  menuBtn.classList.add('menu-btn');
  menuBtn.ariaLabel = 'Project options';

  const menuIcon = createIcon('dots-vertical');

  menuBtn.append(menuIcon);
  menuDiv.append(menuBtn);

  const _projectMenuRename = () => {
    renameProjectDialog(projectName);
    dialog.showModal();
  };
  const _projectMenuDelete = () => {
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
        .addEventListener('click', _projectMenuRename);
      menuDiv
        .querySelector('.delete-btn')
        .addEventListener('click', _projectMenuDelete);
    },
    onHide() {
      menuDiv
        .querySelector('.rename-btn')
        .removeEventListener('click', _projectMenuRename);
      menuDiv
        .querySelector('.delete-btn')
        .removeEventListener('click', _projectMenuDelete);
    },
  });

  return menuDiv;
};

const createTodoMenu = (projectName, todo) => {
  const menuDiv = document.createElement('div');
  menuDiv.classList.add('menu-container');

  const menuBtn = document.createElement('button');
  menuBtn.setAttribute('type', 'button');
  menuBtn.classList.add('menu-btn');
  menuBtn.ariaLabel = 'To-do options';

  const menuIcon = createIcon('dots-vertical');

  menuBtn.append(menuIcon);
  menuDiv.append(menuBtn);

  const _todoMenuEdit = () => {
    todoDialog(projectName, todo);
    dialog.showModal();
  };
  const _todoMenuDelete = () => {
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
        .addEventListener('click', _todoMenuEdit);
      menuDiv
        .querySelector('.delete-btn')
        .addEventListener('click', _todoMenuDelete);
    },
    onHide() {
      menuDiv
        .querySelector('.edit-btn')
        .removeEventListener('click', _todoMenuEdit);
      menuDiv
        .querySelector('.delete-btn')
        .removeEventListener('click', _todoMenuDelete);
    },
  });

  return menuDiv;
};

export {
  createProjectMenu,
  createTodoMenu,
}