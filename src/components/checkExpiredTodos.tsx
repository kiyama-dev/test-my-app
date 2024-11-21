export const checkExpiredTodos = (todos: any[]) => {
  const now = new Date();
  const hasExpiredTodos = todos.some((todo: any) => {
    const deadline = new Date(`${todo.deadline}T${todo.deadlineTime}`);
    return deadline <= now && !todo.completed;
  });

  if (hasExpiredTodos) {
    alert('期限切れのタスクがあります！'); 
  }
}; 