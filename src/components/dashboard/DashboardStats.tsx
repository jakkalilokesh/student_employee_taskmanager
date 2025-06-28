import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { useTask } from '../../context/TaskContext';

export const DashboardStats: React.FC = () => {
  const { stats } = useTask();

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: CheckCircle,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Completed',
      value: stats.completedTasks,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending',
      value: stats.pendingTasks,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Overdue',
      value: stats.overdueTasks,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card hover className="relative overflow-hidden">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor} mr-4`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 hover:opacity-5 transition-opacity duration-300`} />
          </Card>
        </motion.div>
      ))}
    </div>
  );
};