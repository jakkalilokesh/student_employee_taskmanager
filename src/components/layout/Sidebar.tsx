import React from 'react';
import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  CheckSquare, 
  Plus, 
  BarChart3, 
  User, 
  Settings,
  Calendar,
  Archive,
  Star
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'All Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Create Task', href: '/create-task', icon: Plus },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Important', href: '/important', icon: Star },
  { name: 'Archive', href: '/archive', icon: Archive },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
      <div className="p-6">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <motion.div
                    className="flex items-center w-full"
                    whileHover={{ x: isActive ? 0 : 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </motion.div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Quick Stats */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Tasks</span>
            <span className="text-sm font-medium text-gray-900">12</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Completed</span>
            <span className="text-sm font-medium text-green-600">8</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Pending</span>
            <span className="text-sm font-medium text-orange-600">4</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Overdue</span>
            <span className="text-sm font-medium text-red-600">1</span>
          </div>
        </div>
      </div>
    </div>
  );
};