import { Task } from '../types';

class TaskService {
  private apiUrl = import.meta.env.VITE_API_GATEWAY_URL;

  async getTasks(userId: string): Promise<Task[]> {
    try {
      const token = await this.getAuthToken();
      const res = await fetch(`${this.apiUrl}/tasks?userId=${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
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
      const res = await fetch(`${this.apiUrl}/tasks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...taskData, userId }),
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err) {
      console.error('Failed to create task:', err);
      throw err;
    }
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    try {
      const token = await this.getAuthToken();
      const res = await fetch(`${this.apiUrl}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err) {
      console.error('Failed to update task:', err);
      throw err;
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      const token = await this.getAuthToken();
      const res = await fetch(`${this.apiUrl}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (err) {
      console.error('Failed to delete task:', err);
      throw err;
    }
  }

  private async getAuthToken(): Promise<string> {
    const { fetchAuthSession } = await import('aws-amplify/auth');
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString();
    if (!token) throw new Error('No auth token found');
    return token;
  }
}

export const taskService = new TaskService();
