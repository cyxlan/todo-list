import {
  DuplicateNameError,
  createProject,
  renameProject,
  getProjectNames,
} from './project';
import {
  addTodo,
  editTodo,
} from './todo';
import { updateDisplay } from './display';

function _createFormField(labelText, field) {
  const label = document.createElement('label');
  label.setAttribute('for', field.id);
  label.textContent = labelText;

  const input = document.createElement(field.element);
  if (field.type) {
    input.setAttribute('type', field.type);
  }
  input.id = field.id;
  input.classList.add('form-input');

  return { label, input }
}

function _addFormField(formFields, field) {
  const li = document.createElement('li');
  li.append(field.label, field.input);
  formFields.append(li);
}

function _generateDialogForm(headerText, nameLabelText) {
  const dialogForm = document.querySelector('#dialog-form');
  dialogForm.textContent = '';

  const dialogHeader = document.createElement('h2');
  dialogHeader.textContent = headerText;

  const formFields = document.createElement('ul');
  formFields.id = 'form-fields';

  const name = _createFormField(`${nameLabelText} name (required)`, {
    id: 'name-input',
    element: 'input',
    type: 'text',
  });
  name.input.setAttribute('autofocus', 'autofocus');

  _addFormField(formFields, name);

  const dialogBtns = document.createElement('div');
  dialogBtns.classList.add('dialog-btns');

  const submitBtn = document.createElement('button');
  submitBtn.setAttribute('type', 'submit');
  submitBtn.id = 'submit-btn';
  submitBtn.textContent = 'Submit';

  const cancelBtn = document.createElement('button');
  cancelBtn.setAttribute('type', 'button');
  cancelBtn.id = 'cancel-btn';
  cancelBtn.textContent = 'Cancel';

  cancelBtn.addEventListener('click', () => {
    dialog.close();
  });

  dialogBtns.append(submitBtn, cancelBtn);

  dialogForm.append(
    dialogHeader,
    formFields,
    dialogBtns
  );

  return {
    submitBtn,
    formFields,
    nameInput: name.input
  };
}

function newProjectDialog() {
  const dialogForm = _generateDialogForm(
    'New Project',
    'Project'
  );

  dialogForm.submitBtn.addEventListener('click', (e) => {
    _submitForm(e, () => {
      createProject(dialogForm.nameInput.value);
    });
  });
}

function renameProjectDialog(oldName) {
  const dialogForm = _generateDialogForm(
    'Rename Project',
    'Project'
  );
  nameInput.value = oldName;

  dialogForm.submitBtn.addEventListener('click', (e) => {
    _submitForm(e, () => {
      renameProject(oldName, dialogForm.nameInput.value);
    });
  });
}

function _generateTodoForm(currentProject, headerText) {
  const dialogForm = _generateDialogForm(
    headerText,
    'To-do'
  );

  const fields = {
    projectSelect: _createFormField('Project', {
      id: 'project-select',
      element: 'select',
    }),
    prioritySelect: _createFormField('Priority', {
      id: 'priority-select',
      element: 'select',
    }),
    dateInput: _createFormField('Due date', {
      id: 'date-input',
      element: 'input',
      type: 'datetime-local',
    }),
    descInput: _createFormField('Description', {
      id: 'desc-input',
      element: 'textarea',
    }),
  };

  for (const projectName of getProjectNames()) {
    const option = new Option(projectName, projectName);
    // if this dialog was triggered from a project/todo, set the corresponding project to be selected by default
    if (projectName === currentProject) {
      option.setAttribute('selected', 'true');
    }
    fields.projectSelect.input.append(option);
  }

  for (const priority of ['Low', 'Medium', 'High']) {
    const option = new Option(priority, priority);
    fields.prioritySelect.input.append(option);
  }

  for (const field in fields) {
    _addFormField(dialogForm.formFields, fields[field]);
  }

  return {
    nameInput: dialogForm.nameInput,
    projectSelect: fields.prioritySelect.input,
    dateInput: fields.dateInput.input,
    prioritySelect: fields.prioritySelect.input,
    descInput: fields.descInput.input,
    submitBtn: dialogForm.submitBtn,
  };
}

function todoDialog(projectName, oldTodo) {
  let todoForm;
  // if editing an todo, fill in the fields with the existing values
  if (oldTodo) {
    todoForm = _generateTodoForm(projectName, 'Edit To-Do');

    todoForm.nameInput.value = oldTodo.name;
    todoForm.dateInput.value = oldTodo.dueDate;
    todoForm.prioritySelect.value = oldTodo.priority;
    todoForm.descInput.value = oldTodo.desc;
  } else {
    todoForm = _generateTodoForm(projectName, 'New To-Do');
  }

  todoForm.submitBtn.addEventListener('click', (e) => {
    const newTodo = {
      project: todoForm.projectSelect.value,
      name: todoForm.nameInput.value,
      desc: todoForm.descInput.value,
      dueDate: todoForm.dateInput.value,
      priority: todoForm.prioritySelect.value
    }

    if (oldTodo) {
      _submitForm(e, () => {
        editTodo(projectName, oldTodo, newTodo);
      });
    } else {
      _submitForm(e, () => {
        addTodo(newTodo);
      });
    }
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
