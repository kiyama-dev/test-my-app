"use client";
import React, { useState, useEffect } from 'react';
import { checkExpiredTodos } from './checkExpiredTodos';

export interface Todo {
  id: number;
  content: string;
  deadline: string;
  deadlineTime: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoContent, setNewTodoContent] = useState('');
  const [newTodoDeadline, setNewTodoDeadline] = useState(new Date().toISOString().slice(0, 10));
  const [newTodoDeadlineTime, setNewTodoDeadlineTime] = useState('12:00');
  const [isLoading, setIsLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
    setIsLoading(false);

    // todosの状態が更新された後に期限切れタスクをチェック
    const hasExpired = checkExpiredTodos(todos);
    setIsExpired(hasExpired); // 期限切れタスクがあるかどうかを状態に反映
  }, []); 

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // チェックが全て完了したタイミングでのみメッセージを表示
  useEffect(() => {
    const allCompleted = todos.every((todo) => todo.completed);
    if (todos.length > 0 && allCompleted) {
      alert('おめでとうございます！全てのタスクが完了しました！');
    }
  }, [todos]);

  useEffect(() => {
    if (isExpired) {
      alert('期限切れのタスクがあります！');
    }
  }, [isExpired]);

  const isTodoExpired = (todo: Todo) => {
    const deadline = new Date(`${todo.deadline}T${todo.deadlineTime}`);
    const now = new Date();
    return deadline <= now && !todo.completed;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (newTodoContent.trim() === '') {
      return;
    }
    const newTodo: Todo = {
      id: Date.now(),
      content: newTodoContent,
      deadline: newTodoDeadline,
      deadlineTime: newTodoDeadlineTime,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setNewTodoContent('');
    setNewTodoDeadline(new Date().toISOString().slice(0, 10));
    setNewTodoDeadlineTime('12:00');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoContent(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoDeadline(event.target.value);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoDeadlineTime(event.target.value);
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleToggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-3xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">忘れ物チェッカー</h2>
      <div className="mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="新しいアイテムを追加"
              value={newTodoContent}
              onChange={handleInputChange}
              className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
            >
              <span>+</span>
              <span>追加</span>
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={newTodoDeadline}
              onChange={handleDateChange}
              className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="time"
              value={newTodoDeadlineTime}
              onChange={handleTimeChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      </div>
      {isLoading ? (
        <p>読込中...</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center justify-between p-3 bg-white border rounded-lg ${isTodoExpired(todo) ? 'bg-red-100' : ''}`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo.id)}
                  className="w-5 h-5 border-2 rounded"
                />
                <div className="flex flex-col">
                  <span className={todo.completed ? 'line-through' : ''}>
                    {todo.content}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(todo.deadline).toLocaleDateString()} {todo.deadlineTime}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList; 