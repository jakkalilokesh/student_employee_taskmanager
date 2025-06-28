import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { Task } from '../../types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
}

export const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, task }) => {
  const { user } = useAuth();
  const { createTask, updateTask } = useTask();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'work' as Task['category'],
    priority: 'medium' as Task['priority'],
    status: 'pending' as Task['status'],
    dueDate: '',
    tags: [] as string[],
    reminders: {
      email: true,
      sms: false,
      time: '09:00',
    },
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.split('T')[0],
        tags: task.tags || [],
        reminders: task.reminders || {
          email: true,
          sms: false,
          time: '09:00',
        },
      });
    } else {
      setFormData(prev => ({
        ...prev,
        title: '',
        description: '',
        dueDate: '',
        tags: [],
      }));
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return alert("User not authenticated");

    setLoading(true);
    try {
      const taskData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
      };

      if (task) {
        await updateTask(task.id, taskData);
      } else {
        await createTask(user.id, taskData);
      }
      onClose();
    } catch (err) {
      console.error('Task save error:', err);
      alert('Failed to save task.');
    } finally {
      setLoading(false);
    }
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'Create Task'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={formData.title}
          placeholder="Task title"
          required
          className="input"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          value={formData.description}
          placeholder="Description"
          className="input"
          rows={3}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <select
            value={formData.category}
            className="input"
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Task['category'] })}
          >
            <option value="work">Work</option>
            <option value="study">Study</option>
            <option value="personal">Personal</option>
            <option value="project">Project</option>
          </select>
          <select
            value={formData.priority}
            className="input"
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <input
          type="date"
          required
          value={formData.dueDate}
          className="input"
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        />
        <input
          type="text"
          placeholder="Add tags and press Enter"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleTagAdd(e.currentTarget.value.trim());
              e.currentTarget.value = '';
            }
          }}
          className="input"
        />
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, i) => (
            <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
              #{tag}
              <button
                type="button"
                className="ml-1 text-red-500"
                onClick={() =>
                  setFormData(prev => ({
                    ...prev,
                    tags: prev.tags.filter(t => t !== tag),
                  }))
                }
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex justify-end pt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
