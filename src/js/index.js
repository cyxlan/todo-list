import {
  createProject,
  setProjects
} from './project';
import { updateDisplay } from './display';
import { getStorage } from './storage';

import '../css/index.css';

if (getStorage()) {
  setProjects(getStorage());
} else {
  createProject('Default');
}

updateDisplay();