import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, DashboardStats } from '../types';
import { useAuth } from './AuthContext';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  stats: DashboardStats;
  createTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTask must be used within a TaskProvider');
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
    weeklyProgress: [],
  });

  useEffect(() => {
    if (user?.id) {
      refreshTasks();
    }
  }, [user?.id]);

  const refreshTasks = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const userTasks = await taskService.getTasks(user.id);
      setTasks(userTasks);
      calculateStats(userTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (taskList: Task[]) => {
    const now = new Date();
    const completed = taskList.filter(t => t.status === 'completed').length;
    const pending = taskList.filter(t => t.status !== 'completed').length;
    const overdue = taskList.filter(t => t.status !== 'completed' && new Date(t.dueDate) < now).length;

    const weeklyProgress = generateWeeklyProgress(taskList);

    setStats({
      totalTasks: taskList.length,
      completedTasks: completed,
      pendingTasks: pending,
      overdueTasks: overdue,
      completionRate: taskList.length ? (completed / taskList.length) * 100 : 0,
      weeklyProgress,
    });
  };

  const generateWeeklyProgress = (taskList: Task[]) => {
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return days.map(date => ({
      date,
      completed: taskList.filter(t => t.status === 'completed' && t.updatedAt.startsWith(date)).length,
      created: taskList.filter(t => t.createdAt.startsWith(date)).length,
    }));
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user?.id) return;

    try {
      const newTask = await taskService.createTask(user.id, taskData);
      const updated = [...tasks, newTask];
      setTasks(updated);
      calculateStats(updated);
      toast.success('Task created successfully!');
    } catch (err) {
      console.error('Create task error:', err);
      toast.error('Failed to create task');
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await taskService.updateTask(id, updates);
      const updatedTasks = tasks.map(t => (t.id === id ? updatedTask : t));
      setTasks(updatedTasks);
      calculateStats(updatedTasks);
      toast.success('Task updated successfully!');
    } catch (err) {
      console.error('Update task error:', err);
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      const updatedTasks = tasks.filter(t => t.id !== id);
      setTasks(updatedTasks);
      calculateStats(updatedTasks);
      toast.success('Task deleted successfully!');
    } catch (err) {
      console.error('Delete task error:', err);
      toast.error('Failed to delete task');
    }
  };

  const value: TaskContextType = {
    tasks,
    loading,
    stats,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
