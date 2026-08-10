/**
 * Centralized API Client for Aura Live Web App & Admin Console
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('aura_admin_token') || localStorage.getItem('aura_user_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('aura_admin_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('aura_admin_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async get<T = any>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      console.warn(`[ApiClient GET] ${endpoint} fallback/error:`, error);
      throw error;
    }
  }

  async post<T = any>(endpoint: string, body: any): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      console.warn(`[ApiClient POST] ${endpoint} error:`, error);
      throw error;
    }
  }

  async put<T = any>(endpoint: string, body: any): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      console.warn(`[ApiClient PUT] ${endpoint} error:`, error);
      throw error;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  }
}


export const apiClient = new ApiClient();
