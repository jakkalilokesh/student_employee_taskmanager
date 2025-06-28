import { Task } from '../types';

class TaskService {
  private apiUrl = import.meta.env.VITE_API_GATEWAY_URL;

  async getTasks(userId: string): Promise<Task[]> {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${this.apiUrl}/tasks?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(await response.text());
      return await response.json();
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      return [];
    }
  }

  async createTask(
    userId: string,
    taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Task> {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${this.apiUrl}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...taskData, userId }),
      });
      if (!response.ok) throw new Error(await response.text());
      return await response.json();
    } catch (err) {
      console.error('Failed to create task:', err);
      throw err;
    }
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${this.apiUrl}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error(await response.text());
      return await response.json();
    } catch (err) {
      console.error('Failed to update task:', err);
      throw err;
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${this.apiUrl}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(await response.text());
    } catch (err) {
      console.error('Failed to delete task:', err);
      throw err;
    }
  }

  private async getAuthToken(): Promise<string> {
    const { fetchAuthSession } = await import('aws-amplify/auth');
    const session = await fetchAuthSession();
    return session.tokens?.accessToken?.toString() || '';
  }
}

export const taskService = new TaskService();
