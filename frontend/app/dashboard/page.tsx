"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useTaskContext } from '@/lib/contexts/TaskContext';
import TaskList from '@/components/organisms/TaskList';
import TaskForm from '@/components/organisms/TaskForm';
import TaskFilter from '@/components/molecules/TaskFilter';
import Modal from '@/components/modals/Modal';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import Button from '@/components/atoms/Button';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import LoadingSpinner from '@/components/molecules/LoadingSpinner';
import Toast from '@/components/molecules/Toast';
import type { Task, TaskCreateInput, TaskUpdateInput } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const {
    tasks,
    isLoading,
    error,
    filter,
    filteredTasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    setFilter,
    clearError,
  } = useTaskContext();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Authentication guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  // Fetch tasks on mount
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  // Show loading spinner while checking auth
  if (authLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  // Task counts for filter
  const taskCounts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.is_completed).length,
    completed: tasks.filter((t) => t.is_completed).length,
  };

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  // Handle create task
  const handleCreateTask = async (data: TaskCreateInput) => {
    setIsSubmitting(true);
    try {
      await createTask(data);
      setIsCreateModalOpen(false);
      showToast('Task created successfully!', 'success');
    } catch (error) {
      showToast('Failed to create task. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit task
  const handleEditTask = async (data: TaskUpdateInput) => {
    if (!selectedTask) return;

    setIsSubmitting(true);
    try {
      await updateTask(selectedTask.id, data);
      setIsEditModalOpen(false);
      setSelectedTask(null);
      showToast('Task updated successfully!', 'success');
    } catch (error) {
      showToast('Failed to update task. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete task
  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    setIsSubmitting(true);
    try {
      await deleteTask(selectedTask.id);
      setIsDeleteDialogOpen(false);
      setSelectedTask(null);
      showToast('Task deleted successfully!', 'success');
    } catch (error) {
      showToast('Failed to delete task. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle toggle task
  const handleToggleTask = async (id: number) => {
    try {
      await toggleTask(id);
    } catch (error) {
      // Error is handled by context
    }
  };

  // Open edit modal
  const openEditModal = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setSelectedTask(task);
      setIsEditModalOpen(true);
    }
  };

  // Open delete dialog
  const openDeleteDialog = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setSelectedTask(task);
      setIsDeleteDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {user.username}!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="primary"
                onClick={() => setIsCreateModalOpen(true)}
              >
                + Create Task
              </Button>
              <Button variant="secondary" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <ErrorMessage message={error} className="mb-6" />
        )}

        {/* Task Filter */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="px-6 pt-4">
            <TaskFilter
              currentFilter={filter}
              onFilterChange={setFilter}
              taskCounts={taskCounts}
            />
          </div>
        </div>

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          filter={filter}
          onToggle={handleToggleTask}
          onEdit={openEditModal}
          onDelete={openDeleteDialog}
          isLoading={isLoading}
          onCreateTask={() => setIsCreateModalOpen(true)}
        />
      </main>

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
        size="md"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        title="Edit Task"
        size="md"
      >
        <TaskForm
          initialData={selectedTask || undefined}
          onSubmit={handleEditTask}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedTask(null);
          }}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedTask(null);
        }}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${selectedTask?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isSubmitting}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
