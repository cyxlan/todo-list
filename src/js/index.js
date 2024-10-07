import { createProject } from './project';
import { addTodo } from './todo';
import { updateDisplay } from './display';

import '../css/index.css';

createProject('Default');

// test data
createProject('Project 2');
addTodo({
  project: 'Default',
  name: 'Task 1',
  desc: '',
  dueDate: '',
  priority: 'Low'
});
addTodo({
  project: 'Default',
  name: 'Task 2',
  desc: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Habitasse posuere sociosqu eget lobortis feugiat odio nam nam. Sed ex velit ante nec fames dolor.',
  dueDate: '2024-09-08T00:00',
  priority: 'Medium'
});
addTodo({
  project: 'Default',
  name: 'Task 3',
  desc: '',
  dueDate: '2024-10-04T00:00',
  priority: 'High'
});

updateDisplay();