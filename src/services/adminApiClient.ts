export interface AdminDashboardData {
  totalUsers: number;
  activeRooms: number;
  totalResellers: number;
  pendingResellerApps: number;
  totalWithdrawals: number;
  pendingReports: number;
  totalCoins: number;
  totalDiamonds: number;
  systemHealth: string;
  timestamp: string;
}

export interface AdminUserRecord {
  id: number;
  numericId: number;
  username: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  level: number;
  vipTier: number;
  coins: number;
  diamonds: number;
  role: string;
  status: string;
  walletFrozen: boolean;
  country: string | null;
  createdAt: string;
}

class AdminApiClient {
  private getHeaders() {
    const token = localStorage.getItem('aura_token') || localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || ''}`,
    };
  }

  async getDashboard(): Promise<AdminDashboardData | null> {
    try {
      const res = await fetch('/api/v1/admin/dashboard', { headers: this.getHeaders() });
      const data = await res.json();
      if (data.success) return data.data;
    } catch (_) {}
    return null;
  }

  async getUsers(params?: { query?: string; status?: string; role?: string }): Promise<AdminUserRecord[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.query) queryParams.set('query', params.query);
      if (params?.status) queryParams.set('status', params.status);
      if (params?.role) queryParams.set('role', params.role);

      const res = await fetch(`/api/v1/admin/users?${queryParams.toString()}`, {
        headers: this.getHeaders(),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    } catch (_) {}
    return [];
  }

  async getUserDetails(id: number): Promise<any | null> {
    try {
      const res = await fetch(`/api/v1/admin/users/${id}`, { headers: this.getHeaders() });
      const data = await res.json();
      if (data.success) return data.data;
    } catch (_) {}
    return null;
  }

  async updateUserStatus(id: number, status: string, reason?: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/v1/admin/users/${id}/status`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ status, reason }),
      });
      const data = await res.json();
      return data.success === true;
    } catch (_) {}
    return false;
  }

  async updateUserRole(id: number, role: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/v1/admin/users/${id}/role`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      return data.success === true;
    } catch (_) {}
    return false;
  }

  async creditUserWallet(id: number, amount: number, type: 'coins' | 'diamonds'): Promise<boolean> {
    try {
      const res = await fetch(`/api/v1/admin/users/${id}/credit`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ amount, type }),
      });
      const data = await res.json();
      return data.success === true;
    } catch (_) {}
    return false;
  }

  async freezeUserWallet(id: number, frozen: boolean): Promise<boolean> {
    try {
      const res = await fetch(`/api/v1/admin/users/${id}/freeze-wallet`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ frozen }),
      });
      const data = await res.json();
      return data.success === true;
    } catch (_) {}
    return false;
  }

  async getAuditLogs(): Promise<any[]> {
    try {
      const res = await fetch('/api/v1/admin/audit-logs', { headers: this.getHeaders() });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) return data.data;
    } catch (_) {}
    return [];
  }
}

export const adminApiClient = new AdminApiClient();
