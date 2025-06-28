export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'employee';
  avatar?: string;
  createdAt: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'work' | 'study' | 'personal' | 'project';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  tags?: string[];
  reminders?: {
    email: boolean;
    sms: boolean;
    time: string;
  };
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
  weeklyProgress: {
    date: string;
    completed: number;
    created: number;
  }[];
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  reminders: {
    beforeDue: number; // hours
    dailyDigest: boolean;
    weeklyReport: boolean;
  };
}