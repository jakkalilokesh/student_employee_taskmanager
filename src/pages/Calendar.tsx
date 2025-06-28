import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TaskForm } from '../components/tasks/TaskForm';
import { useTask } from '../context/TaskContext';
import { Task } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from 'date-fns';

export const Calendar: React.FC = () => {
  const { tasks } = useTask();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      isSameDay(new Date(task.dueDate), date)
    );
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">View and manage your tasks by date</p>
        </div>
        <Button
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setShowTaskForm(true)}
        >
          Add Task
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                    icon={<ChevronLeft className="h-4 w-4" />}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                    icon={<ChevronRight className="h-4 w-4" />}
                  />
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {calendarDays.map(day => {
                  const dayTasks = getTasksForDate(day);
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentDay = isToday(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);

                  return (
                    <motion.button
                      key={day.toISOString()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        p-2 min-h-[80px] border border-gray-100 rounded-lg transition-all duration-200
                        ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}
                        ${isCurrentDay && !isSelected ? 'bg-blue-50 border-blue-200' : ''}
                        ${!isCurrentMonth ? 'text-gray-300' : ''}
                      `}
                    >
                      <div className="text-sm font-medium mb-1">
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayTasks.slice(0, 2).map(task => (
                          <div
                            key={task.id}
                            className={`
                              w-full h-1 rounded-full
                              ${isSelected ? 'bg-white' : getPriorityColor(task.priority)}
                            `}
                          />
                        ))}
                        {dayTasks.length > 2 && (
                          <div className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                            +{dayTasks.length - 2} more
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Selected Date Tasks */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {format(selectedDate, 'EEEE, MMMM d')}
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {selectedDateTasks.length} tasks
                </div>
              </div>

              <div className="space-y-3">
                {selectedDateTasks.length > 0 ? (
                  selectedDateTasks.map(task => (
                    <motion.div
                      key={task.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleEditTask(task)}
                      className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                            <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                          </div>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span className="capitalize">{task.category}</span>
                            <span className="capitalize">{task.priority}</span>
                            <span className={`
                              px-2 py-1 rounded-full text-xs
                              ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'}
                            `}>
                              {task.status.replace('-', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">No tasks for this date</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => setShowTaskForm(true)}
                    >
                      Add Task
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Tasks</span>
                  <span className="font-medium">{tasks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-medium text-green-600">
                    {tasks.filter(t => t.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="font-medium text-blue-600">
                    {tasks.filter(t => t.status === 'in-progress').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-medium text-orange-600">
                    {tasks.filter(t => t.status === 'pending').length}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={showTaskForm}
        onClose={handleCloseForm}
        task={editingTask}
      />
    </div>
  );
};