import { Todo } from './TodoList';

export const checkExpiredTodos = (todos: Todo[]): boolean => {
  const now = new Date();
  return todos.some((todo: Todo) => {
    const deadline = new Date(`${todo.deadline}T${todo.deadlineTime}`);
    return deadline <= now && !todo.completed;
  });
}; 