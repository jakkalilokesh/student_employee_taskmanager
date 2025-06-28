import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md'
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 ${paddingClasses[padding]} ${className}`}
      whileHover={hover ? { y: -2, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};