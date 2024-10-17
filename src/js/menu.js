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

function _generateMenu(labelName, options) {
  const menuDiv = document.createElement('div');
  menuDiv.classList.add('menu-container');

  const menuBtn = document.createElement('button');
  menuBtn.setAttribute('type', 'button');
  menuBtn.classList.add('menu-btn');
  menuBtn.ariaLabel = `${labelName} options`;

  menuBtn.append(createIcon('dots-vertical'));
  menuDiv.append(menuBtn);

  tippy(menuBtn, {
    content: `
      <div class="menu-popup">
        <button class="${options.btn1.class}">${options.btn1.text}</button>
        <button class="${options.btn2.class}">${options.btn2.text}</button>
      </div>`,
    onShown() {
      menuDiv
        .querySelector(`.${options.btn1.class}`)
        .addEventListener('click', options.btn1.function);
      menuDiv
        .querySelector(`.${options.btn2.class}`)
        .addEventListener('click', options.btn2.function);
    },
    onHide() {
      menuDiv
        .querySelector(`.${options.btn1.class}`)
        .removeEventListener('click', options.btn1.function);
      menuDiv
        .querySelector(`.${options.btn2.class}`)
        .removeEventListener('click', options.btn2.function);
    },
  });

  return menuDiv;
}

function createProjectMenu(projectName) {
  const _projectMenuRename = () => {
    renameProjectDialog(projectName);
    dialog.showModal();
  };
  const _projectMenuDelete = () => {
    deleteProject(projectName);
    updateDisplay();
  };

  const menuDiv = _generateMenu('Project', {
    btn1: {
      class: 'rename-btn',
      text: 'Rename',
      function: _projectMenuRename,
    },
    btn2: {
      class: 'delete-btn',
      text: 'Delete',
      function: _projectMenuDelete,
    }
  });

  return menuDiv;
}

function createTodoMenu(projectName, todo) {
  const _todoMenuEdit = () => {
    todoDialog(projectName, todo);
    dialog.showModal();
  };
  const _todoMenuDelete = () => {
    deleteTodo(projectName, todo);
    updateDisplay();
  };

  const menuDiv = _generateMenu('To-do', {
    btn1: {
      class: 'edit-btn',
      text: 'Edit',
      function: _todoMenuEdit,
    },
    btn2: {
      class: 'delete-btn',
      text: 'Delete',
      function: _todoMenuDelete,
    }
  });

  return menuDiv;
};

export {
  createProjectMenu,
  createTodoMenu,
};