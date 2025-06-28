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
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      refreshTasks();
    }
  }, [user]);

  const refreshTasks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
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
    const completed = taskList.filter(task => task.status === 'completed').length;
    const pending = taskList.filter(task => task.status !== 'completed').length;
    const overdue = taskList.filter(task => 
      task.status !== 'completed' && new Date(task.dueDate) < now
    ).length;

    setStats({
      totalTasks: taskList.length,
      completedTasks: completed,
      pendingTasks: pending,
      overdueTasks: overdue,
      completionRate: taskList.length > 0 ? (completed / taskList.length) * 100 : 0,
      weeklyProgress: generateWeeklyProgress(taskList),
    });
  };

  const generateWeeklyProgress = (taskList: Task[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => ({
      date,
      completed: taskList.filter(task => 
        task.status === 'completed' && 
        task.updatedAt.startsWith(date)
      ).length,
      created: taskList.filter(task => 
        task.createdAt.startsWith(date)
      ).length,
    }));
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const newTask = await taskService.createTask(user.id, taskData);
      setTasks(prev => [...prev, newTask]);
      calculateStats([...tasks, newTask]);
      toast.success('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await taskService.updateTask(id, updates);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      calculateStats(tasks.map(task => task.id === id ? updatedTask : task));
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      calculateStats(updatedTasks);
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const value = {
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