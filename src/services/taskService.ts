import { Task } from '../types';

// Mock API service - replace with actual AWS API Gateway endpoints
class TaskService {
  private apiUrl = 'https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod';

  async getTasks(userId: string): Promise<Task[]> {
    // Mock data for demonstration
    const mockTasks: Task[] = [
      {
        id: '1',
        userId,
        title: 'Complete React Project',
        description: 'Finish the task manager application with AWS integration',
        category: 'work',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['react', 'aws', 'project'],
        reminders: {
          email: true,
          sms: false,
          time: '09:00',
        },
      },
      {
        id: '2',
        userId,
        title: 'Study for Exam',
        description: 'Prepare for the upcoming computer science exam',
        category: 'study',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(Date.now() + 172800000).toISOString(),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        tags: ['exam', 'study'],
        reminders: {
          email: true,
          sms: true,
          time: '08:00',
        },
      },
      {
        id: '3',
        userId,
        title: 'Team Meeting',
        description: 'Weekly team sync meeting',
        category: 'work',
        priority: 'medium',
        status: 'completed',
        dueDate: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        tags: ['meeting', 'team'],
        reminders: {
          email: true,
          sms: false,
          time: '10:00',
        },
      },
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTasks;
  }

  async createTask(userId: string, taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return newTask;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    // In a real implementation, this would make an API call
    const updatedTask = {
      id,
      ...updates,
      updatedAt: new Date().toISOString(),
    } as Task;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const taskService = new TaskService();