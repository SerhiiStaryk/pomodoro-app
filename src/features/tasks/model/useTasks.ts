import { useEffect, useMemo, useState } from 'react';
import { loadTasks, saveTasks } from '../../../shared/lib/storage';
import type { Task } from '../../../shared/types';

const createId = (): string => {
  // Reasonable collision resistance for a small local-only list.
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (text: string): boolean => {
    const trimmed = text.trim();
    if (!trimmed) return false;

    const now = Date.now();
    const nextTask: Task = {
      id: createId(),
      text: trimmed,
      completed: false,
      createdAt: now,
      completedAt: null,
    };

    setTasks((prev) => [nextTask, ...prev]);
    return true;
  };

  const toggleTask = (taskId: string): void => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;

        const completed = !task.completed;
        return {
          ...task,
          completed,
          completedAt: completed ? Date.now() : null,
        };
      })
    );
  };

  const deleteTask = (taskId: string): void => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    return { total, completed };
  }, [tasks]);

  return {
    tasks,
    stats,
    addTask,
    toggleTask,
    deleteTask,
  };
};
