import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, CheckCircle, Clock } from 'lucide-react';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { WeeklyProgress } from '../components/dashboard/WeeklyProgress';
import { TaskCard } from '../components/tasks/TaskCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { TaskForm } from '../components/tasks/TaskForm';
import { Task } from '../types';

const Dashboard: React.FC = () => {
  const { tasks } = useTask();
  const { user } = useAuth();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const recentTasks = tasks.slice(0, 4);
  const upcomingTasks = tasks
    .filter(task => task.status !== 'completed' && new Date(task.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  return (
    <div className="p-6 space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your tasks today.</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setShowTaskForm(true)}>Create Task</Button>
      </motion.div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <WeeklyProgress />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="space-y-4">
                {recentTasks.length > 0 ? recentTasks.map(task => (
                  <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No tasks yet. Create your first task to get started!</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start" icon={<Plus className="h-4 w-4" />} onClick={() => setShowTaskForm(true)}>Create New Task</Button>
                <Button variant="outline" size="sm" className="w-full justify-start" icon={<Calendar className="h-4 w-4" />}>View Calendar</Button>
                <Button variant="outline" size="sm" className="w-full justify-start" icon={<CheckCircle className="h-4 w-4" />}>Review Completed</Button>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }}>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
              <div className="space-y-3">
                {upcomingTasks.length > 0 ? upcomingTasks.map(task => (
                  <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                      <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-4 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No upcoming tasks</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }}>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Categories</h3>
              <div className="space-y-2">
                {['work', 'study', 'personal', 'project'].map(category => {
                  const categoryTasks = tasks.filter(task => task.category === category);
                  const completedCount = categoryTasks.filter(task => task.status === 'completed').length;
                  const totalCount = categoryTasks.length;
                  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700 capitalize">{category}</span>
                        <span className="text-gray-500">{completedCount}/{totalCount}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <TaskForm isOpen={showTaskForm} onClose={handleCloseForm} task={editingTask} />
    </div>
  );
};

export default Dashboard;
