import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Archive as ArchiveIcon, Search, Filter, RotateCcw, Trash2, Calendar } from 'lucide-react';
import { TaskCard } from '../components/tasks/TaskCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useTask } from '../context/TaskContext';
import { Task } from '../types';
import { format } from 'date-fns';

export const Archive: React.FC = () => {
  const { tasks, updateTask, deleteTask } = useTask();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'category' | 'priority'>('date');

  // Filter completed tasks (archived)
  const archivedTasks = tasks.filter(task => task.status === 'completed');

  const filteredTasks = archivedTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'category':
        return a.category.localeCompare(b.category);
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      default:
        return 0;
    }
  });

  const handleRestoreTask = async (task: Task) => {
    await updateTask(task.id, { status: 'pending' });
  };

  const handlePermanentDelete = async (taskId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this task? This action cannot be undone.')) {
      await deleteTask(taskId);
    }
  };

  const handleEditTask = (task: Task) => {
    // For archived tasks, we'll just show details or allow restore
    console.log('Viewing archived task:', task);
  };

  // Group tasks by completion date
  const groupedTasks = sortedTasks.reduce((groups, task) => {
    const date = format(new Date(task.updatedAt), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {} as Record<string, Task[]>);

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
            <ArchiveIcon className="h-8 w-8 text-gray-600" />
            <h1 className="text-3xl font-bold text-gray-900">Archive</h1>
          </div>
          <p className="text-gray-600 mt-1">View and manage your completed tasks</p>
        </div>
        <div className="text-sm text-gray-500">
          {archivedTasks.length} completed tasks
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['work', 'study', 'personal', 'project'].map((category, index) => {
          const categoryTasks = archivedTasks.filter(task => task.category === category);
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{categoryTasks.length}</p>
                  <p className="text-sm text-gray-600 capitalize">{category} Tasks</p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search archived tasks..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="work">Work</option>
                <option value="study">Study</option>
                <option value="personal">Personal</option>
                <option value="project">Project</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'category' | 'priority')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="category">Sort by Category</option>
                <option value="priority">Sort by Priority</option>
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Archived Tasks */}
      {sortedTasks.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([date, tasks], groupIndex) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + groupIndex * 0.1 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                    Completed on {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                  </h3>
                  <span className="text-sm text-gray-500">{tasks.length} tasks</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasks.map((task, taskIndex) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: taskIndex * 0.05 }}
                      className="relative group"
                    >
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRestoreTask(task)}
                            icon={<RotateCcw className="h-3 w-3" />}
                            className="bg-white shadow-md hover:bg-blue-50"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePermanentDelete(task.id)}
                            icon={<Trash2 className="h-3 w-3" />}
                            className="bg-white shadow-md hover:bg-red-50 text-red-600"
                          />
                        </div>
                      </div>
                      <div className="opacity-75 hover:opacity-100 transition-opacity duration-200">
                        <TaskCard task={task} onEdit={handleEditTask} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <div className="text-center py-12">
              <ArchiveIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterCategory !== 'all' ? 'No matching archived tasks' : 'No archived tasks yet'}
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterCategory !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Complete some tasks to see them here'
                }
              </p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Archive Actions */}
      {archivedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Archive Management</h3>
                <p className="text-sm text-gray-600">Manage your archived tasks</p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to restore all archived tasks?')) {
                      archivedTasks.forEach(task => updateTask(task.id, { status: 'pending' }));
                    }
                  }}
                  icon={<RotateCcw className="h-4 w-4" />}
                >
                  Restore All
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to permanently delete all archived tasks? This action cannot be undone.')) {
                      archivedTasks.forEach(task => deleteTask(task.id));
                    }
                  }}
                  icon={<Trash2 className="h-4 w-4" />}
                >
                  Delete All
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Archive;
