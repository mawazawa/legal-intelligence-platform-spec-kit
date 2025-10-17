"use client";

import React, { useEffect, useMemo } from 'react';
import { ListChecks } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TaskService } from '@/services/TaskService';
// Task type imported but not directly used in this component
import TodoListModal from './TodoListModal';

export function TodoListFab() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tasks, setTasks] = useLocalStorage('fl320-todo-v1-tasks', TaskService.getDefaultTasks());
  const [deadline, setDeadline] = useLocalStorage('fl320-todo-v1-deadline', '');

  // Auto-detect completion for specific tasks
  useEffect(() => {
    const checkCompletions = async () => {
      const tasksToCheck = ['exhibit_index', 'fl320_form'];
      
      for (const taskId of tasksToCheck) {
        const isComplete = await TaskService.checkTaskCompletion(taskId);
        if (isComplete) {
          setTasks(prev => prev.map(t => 
            t.id === taskId ? { ...t, done: true } : t
          ));
        }
      }
    };

    checkCompletions();
  }, [setTasks]);

  const progress = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    const pct = Math.round((done / total) * 100);
    return { total, done, pct };
  }, [tasks]);

  const daysLeft = useMemo(() => {
    if (!deadline) return null;
    const d = new Date(deadline);
    const now = new Date();
    return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }, [deadline]);

  const handleTaskToggle = (id: string, done: boolean) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done } : t));
  };

  const handleMarkAllComplete = () => {
    setTasks(prev => prev.map(t => ({ ...t, done: true })));
  };

  return (
    <>
      {/* FAB */}
      <button
        aria-label="Open FL‑320 To‑Do"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-[60] rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors p-3 no-print"
      >
        <ListChecks className="h-6 w-6" />
      </button>

      {/* Modal */}
      <TodoListModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        tasks={tasks}
        deadline={deadline}
        progress={progress}
        daysLeft={daysLeft}
        onTaskToggle={handleTaskToggle}
        onDeadlineChange={setDeadline}
        onMarkAllComplete={handleMarkAllComplete}
      />
    </>
  );
}
