import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, Filter, Search } from 'lucide-react';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskForm } from '../components/tasks/TaskForm';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useTask } from '../context/TaskContext';
import { Task } from '../types';

export const Important: React.FC = () => {
  const { tasks } = useTask();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [filterPriority, setFilterPriority] = useState<'all' | 'urgent' | 'high'>('all');

  // Filter important tasks (urgent and high priority)
  const importantTasks = tasks.filter(task => {
    const isImportant = task.priority === 'urgent' || task.priority === 'high';
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return isImportant && matchesPriority;
  });

  // Separate by status
  const urgentTasks = importantTasks.filter(task => task.priority === 'urgent');
  const highPriorityTasks = importantTasks.filter(task => task.priority === 'high');
  const overdueTasks = importantTasks.filter(task => 
    new Date(task.dueDate) < new Date() && task.status !== 'completed'
  );

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center space-x-2">
            <Star className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">Important Tasks</h1>
          </div>
          <p className="text-gray-600 mt-1">Focus on your high-priority and urgent tasks</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as 'all' | 'urgent' | 'high')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Important</option>
            <option value="urgent">Urgent Only</option>
            <option value="high">High Priority Only</option>
          </select>
          <Button
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setShowTaskForm(true)}
          >
            Add Important Task
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card hover>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-50 mr-4">
                <Star className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{urgentTasks.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card hover>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-50 mr-4">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-gray-900">{highPriorityTasks.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card hover>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-50 mr-4">
                <Star className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{overdueTasks.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Overdue Tasks Section */}
      {overdueTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-red-600">⚠️ Overdue Tasks</h2>
              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                Needs Immediate Attention
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {overdueTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TaskCard task={task} onEdit={handleEditTask} />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Urgent Tasks Section */}
      {urgentTasks.filter(task => !overdueTasks.includes(task)).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-red-600">🔥 Urgent Tasks</h2>
              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                High Priority
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {urgentTasks.filter(task => !overdueTasks.includes(task)).map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TaskCard task={task} onEdit={handleEditTask} />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* High Priority Tasks Section */}
      {highPriorityTasks.filter(task => !overdueTasks.includes(task)).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-orange-600">⭐ High Priority Tasks</h2>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                Important
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {highPriorityTasks.filter(task => !overdueTasks.includes(task)).map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TaskCard task={task} onEdit={handleEditTask} />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {importantTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="text-center py-12">
              <Star className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Important Tasks</h3>
              <p className="text-gray-500 mb-6">
                You don't have any urgent or high-priority tasks at the moment. Great job staying on top of things!
              </p>
              <Button
                icon={<Plus className="h-4 w-4" />}
                onClick={() => setShowTaskForm(true)}
              >
                Add Important Task
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Task Form Modal */}
      <TaskForm
        isOpen={showTaskForm}
        onClose={handleCloseForm}
        task={editingTask}
      />
    </div>
  );
};