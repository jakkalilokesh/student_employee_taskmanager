import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, MoreVertical, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Task } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useTask } from '../../context/TaskContext';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { updateTask, deleteTask } = useTask();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'text-blue-600 bg-blue-50';
      case 'study': return 'text-purple-600 bg-purple-50';
      case 'personal': return 'text-green-600 bg-green-50';
      case 'project': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleComplete = () => {
    updateTask(task.id, { 
      status: task.status === 'completed' ? 'pending' : 'completed',
      updatedAt: new Date().toISOString()
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card hover className={`relative ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
            <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(task.category)}`}>
              {task.category}
            </span>
            <div className="relative group">
              <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button
                  onClick={() => onEdit(task)}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                >
                  <Edit className="h-3 w-3 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{format(new Date(task.createdAt), 'MMM d')}</span>
            </div>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span className="capitalize">{task.priority}</span>
          </div>
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              task.status === 'completed' ? 'bg-green-500' :
              task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
            }`} />
            <span className="text-sm text-gray-600 capitalize">{task.status.replace('-', ' ')}</span>
          </div>
          <Button
            size="sm"
            variant={task.status === 'completed' ? 'secondary' : 'primary'}
            onClick={handleComplete}
            icon={<CheckCircle className="h-4 w-4" />}
          >
            {task.status === 'completed' ? 'Undo' : 'Complete'}
          </Button>
        </div>

        {isOverdue && (
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>
        )}
      </Card>
    </motion.div>
  );
};