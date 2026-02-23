import React from 'react';
import type { Task } from '@/types';
import Button from '@/components/atoms/Button';
import Checkbox from '@/components/atoms/Checkbox';

interface TaskCardProps {
  task: Task;
  onToggle: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export default function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  isLoading = false,
}: TaskCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 pt-1">
          <Checkbox
            id={`task-${task.id}`}
            name={`task-${task.id}`}
            checked={task.is_completed}
            onChange={() => onToggle(task.id)}
            disabled={isLoading}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-medium text-gray-900 mb-1 transition-all duration-200 ${
              task.is_completed ? 'line-through opacity-60' : ''
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={`text-sm text-gray-600 mb-3 transition-opacity duration-200 ${
                task.is_completed ? 'opacity-60' : ''
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              <span>Created {formatDate(task.created_at)}</span>
              {task.updated_at !== task.created_at && (
                <span className="ml-2">• Updated {formatDate(task.updated_at)}</span>
              )}
            </div>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task.id)}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                disabled={isLoading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
