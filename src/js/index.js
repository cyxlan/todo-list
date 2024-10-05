import { createProject } from "./project";
import { createTodo } from "./todo";
import { updateDisplay } from "./display";

import "../css/index.css";

createProject('Default');

// test data
createProject('Project 2');
createTodo(
  'Default',
  'Task 1',
  '',
  '2024-09-08T00:00',
  'Low'
);
createTodo(
  'Default',
  'Task 2',
  'Lorem ipsum odor amet, consectetuer adipiscing elit. Habitasse posuere sociosqu eget lobortis feugiat odio nam nam. Sed ex velit ante nec fames dolor.',
  '2024-09-08T00:00',
  'Medium'
);
createTodo(
  'Default',
  'Task 3',
  '',
  '2024-10-04T00:00',
  'High'
);

updateDisplay();