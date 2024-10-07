import {
  DuplicateNameError,
  createProject,
  renameProject,
  getProjectNames,
} from './project';
import {
  createTodo,
  deleteTodo
} from './todo';
import { updateDisplay } from './display';

function _generateDialogForm(headerText, nameLabelText) {
  const dialogForm = document.querySelector('#dialog-form');
  dialogForm.textContent = '';

  const dialogHeader = document.createElement('h2');
  dialogHeader.textContent = headerText;

  const nameInputLabel = document.createElement('label');
  nameInputLabel.setAttribute('for', 'name-input');
  nameInputLabel.textContent = nameLabelText;

  const nameInput = document.createElement('input');
  nameInput.setAttribute('type', 'text');
  nameInput.setAttribute('autofocus', 'autofocus');
  nameInput.id = 'name-input';

  const dialogSubmit = document.createElement('button');
  dialogSubmit.setAttribute('type', 'submit');
  dialogSubmit.id = 'submit-btn';
  dialogSubmit.textContent = 'Submit';

  const dialogCancel = document.createElement('button');
  dialogCancel.setAttribute('type', 'button');
  dialogCancel.id = 'cancel-btn';
  dialogCancel.textContent = 'Cancel';

  dialogCancel.addEventListener('click', () => {
    dialog.close();
  });

  dialogForm.append(
    dialogHeader,
    nameInputLabel,
    nameInput,
    dialogSubmit,
    dialogCancel
  );

  return [dialogSubmit, nameInput];
}

function newProjectDialog() {
  const [dialogSubmit, nameInput] = _generateDialogForm(
    'New Project',
    'Project name'
  );

  dialogSubmit.addEventListener('click', (e) => {
    _submitForm(e, () => {
      createProject(nameInput.value);
    });
  });
}

function renameProjectDialog(oldName) {
  const [dialogSubmit, nameInput] = _generateDialogForm(
    'Rename Project',
    'Project name'
  );
  nameInput.value = oldName;

  dialogSubmit.addEventListener('click', (e) => {
    _submitForm(e, () => {
      renameProject(oldName, nameInput.value);
    });
  });
}

function _generateTodoForm(currentProject, headerText) {
  const [dialogSubmit, nameInput] = _generateDialogForm(
    headerText,
    'To-do name'
  );

  const projectSelectLabel = document.createElement('label');
  projectSelectLabel.textContent = 'Project';
  projectSelectLabel.setAttribute('for', 'project-select');

  const projectSelect = document.createElement('select');
  projectSelect.id = 'project-select';
  for (const projectName of getProjectNames()) {
    const option = new Option(projectName, projectName);
    // if this dialog was triggered from a project/todo, set the corresponding project to be selected by default
    if (projectName === currentProject) {
      option.setAttribute('selected', 'true');
    }
    projectSelect.append(option);
  }

  const dateInputLabel = document.createElement('label');
  dateInputLabel.textContent = 'Due date';
  dateInputLabel.setAttribute('for', 'date-input');

  const dateInput = document.createElement('input');
  dateInput.setAttribute('type', 'datetime-local');
  dateInput.id = 'date-input';

  const prioritySelectLabel = document.createElement('label');
  prioritySelectLabel.textContent = 'Priority';
  prioritySelectLabel.setAttribute('for', 'priority-select');

  const prioritySelect = document.createElement('select');
  prioritySelect.id = 'priority-select';
  for (const priority of ['Low', 'Medium', 'High']) {
    const option = new Option(priority, priority);
    prioritySelect.append(option);
  }

  const descInputLabel = document.createElement('label');
  descInputLabel.textContent = 'Description';
  descInputLabel.setAttribute('for', 'desc-input');

  const descInput = document.createElement('textarea');
  descInput.id = 'desc-input';

  nameInput.after(
    projectSelectLabel,
    projectSelect,
    dateInputLabel,
    dateInput,
    prioritySelectLabel,
    prioritySelect,
    descInputLabel,
    descInput
  );

  return {
    nameInput,
    projectSelect,
    dateInput,
    prioritySelect,
    descInput,
    dialogSubmit,
  };
}

function todoDialog(projectName, todo) {
  let todoForm;
  // if editing an todo, fill in the fields with the existing values
  if (todo) {
    todoForm = _generateTodoForm(projectName, 'Edit To-Do');

    todoForm.nameInput.value = todo.name;
    todoForm.dateInput.value = todo.dueDate;
    todoForm.prioritySelect.value = todo.priority;
    todoForm.descInput.value = todo.desc;
  } else {
    todoForm = _generateTodoForm(projectName, 'New To-Do');
  }

  todoForm.dialogSubmit.addEventListener('click', (e) => {
    // if editing an todo, delete the old todo before creating a new one
    if (todo) {
      deleteTodo(projectName, todo);
    }
    _submitForm(e, () => {
      createTodo(
        todoForm.projectSelect.value,
        todoForm.nameInput.value,
        todoForm.descInput.value,
        todoForm.dateInput.value,
        todoForm.prioritySelect.value
      );
    });
  });
}

function _submitForm(e, createFunction) {
  try {
    createFunction();
    updateDisplay();
  } catch (error) {
    // prevent refresh after alert dismissed
    e.preventDefault();
    alert(error.message);
    // if error was duplicate project name, clear name input
    if (error instanceof DuplicateNameError) {
      document.querySelector('#name-input').value = '';
    }
  }
}

export {
  newProjectDialog,
  renameProjectDialog,
  todoDialog
};
