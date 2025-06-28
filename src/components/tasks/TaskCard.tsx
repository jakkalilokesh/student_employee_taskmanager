import React from 'react';
import { Calendar, Clock, Edit, Trash2, CheckCircle } from 'lucide-react';
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
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <Card className={`relative ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through' : ''}`}>
            {task.title}
          </h3>
          <p className="text-gray-600 text-sm">{task.description}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(task)} className="text-blue-500 hover:text-blue-700">
            <Edit size={16} />
          </button>
          <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-500 mt-2 flex justify-between">
        <span><Calendar size={12} className="inline" /> {format(new Date(task.dueDate), 'MMM d')}</span>
        <span><Clock size={12} className="inline" /> {format(new Date(task.createdAt), 'p')}</span>
      </div>
      <div className="mt-2">
        <Button
          size="sm"
          variant={task.status === 'completed' ? 'secondary' : 'primary'}
          onClick={() =>
            updateTask(task.id, {
              status: task.status === 'completed' ? 'pending' : 'completed',
              updatedAt: new Date().toISOString(),
            })
          }
          icon={<CheckCircle size={14} />}
        >
          {task.status === 'completed' ? 'Undo' : 'Complete'}
        </Button>
      </div>
    </Card>
  );
};
