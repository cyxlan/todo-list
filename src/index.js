import { createProject, renameProject, deleteProject, getProjectNames, getProjectTodos } from "./project";
import { createTodo, toggleTodoComplete, editTodo, deleteTodo, changeTodoProject } from "./todo";

const displayController = (function() {
  const printTodoList = () => {
    console.log("TO-DO LIST")
    for (const projectName of getProjectNames()) {
      console.log("Project:", projectName);

      const todos = getProjectTodos(projectName);
      if (todos.length === 0) {
        console.log("No tasks yet")
      } else {
        for (const todo of todos) {
          console.log({...todo});
        }
      }
    }
  }

  printTodoList();
})();