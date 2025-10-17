"use client";

import React from 'react';
import { X, Calendar, Link as LinkIcon } from 'lucide-react';
import { Task } from '@/types/Task';

interface TodoListModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  deadline: string;
  progress: { total: number; done: number; pct: number };
  daysLeft: number | null;
  onTaskToggle: (id: string, done: boolean) => void;
  onDeadlineChange: (deadline: string) => void;
  onMarkAllComplete: () => void;
}

const TodoListModal: React.FC<TodoListModalProps> = ({
  isOpen,
  onClose,
  tasks,
  deadline,
  progress,
  daysLeft,
  onTaskToggle,
  onDeadlineChange,
  onMarkAllComplete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-4 bottom-4 w-[380px] max-w-[92vw] bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-3 border-b flex items-center justify-between">
          <div className="font-semibold text-slate-800 text-sm">FL‑320 Filing Checklist</div>
          <button 
            aria-label="Close" 
            onClick={onClose} 
            className="text-slate-500 hover:text-black"
          >
            <X className="h-4 w-4"/>
          </button>
        </div>

        <div className="p-3">
          {/* Progress */}
          <div className="mb-3">
            <div className="text-xs text-slate-600 mb-1">
              Progress: {progress.done}/{progress.total} ({progress.pct}%)
            </div>
            <div className="h-2 bg-slate-100 rounded overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300" 
                style={{ width: `${progress.pct}%` }} 
              />
            </div>
          </div>

          {/* Deadline */}
          <div className="mb-3 p-2 rounded border bg-slate-50">
            <div className="flex items-center gap-2 text-xs text-slate-700 mb-1">
              <Calendar className="h-3.5 w-3.5"/> 
              Filing/ Hearing Deadline
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={deadline} 
                onChange={e => onDeadlineChange(e.target.value)} 
                className="w-full border rounded px-2 py-1 text-sm" 
              />
              <div className="text-xs text-slate-600 min-w-[70px] text-right">
                {daysLeft !== null ? `${daysLeft} d` : '—'}
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="max-h-[50vh] overflow-auto pr-1 space-y-2">
            {tasks.map(task => (
              <label 
                key={task.id} 
                className="flex items-start gap-2 border rounded p-2 hover:bg-slate-50 cursor-pointer"
              >
                <input 
                  type="checkbox" 
                  className="mt-1" 
                  checked={!!task.done} 
                  onChange={e => onTaskToggle(task.id, e.target.checked)} 
                />
                <div className="text-sm">
                  <div className="font-medium text-slate-800 flex items-center gap-2">
                    {task.label}
                    {task.link && (
                      <a 
                        href={task.link} 
                        className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        <LinkIcon className="h-3 w-3"/> 
                        open
                      </a>
                    )}
                  </div>
                  {task.hint && (
                    <div className="text-xs text-slate-600">{task.hint}</div>
                  )}
                </div>
              </label>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between text-xs">
            <button 
              className="px-2 py-1 border rounded hover:bg-slate-50" 
              onClick={onMarkAllComplete}
            >
              Mark all
            </button>
            <div className="text-slate-500">Saved locally · court‑ready</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoListModal;
