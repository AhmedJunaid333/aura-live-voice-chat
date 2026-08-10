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

  private getBaseUrls(path: string): string[] {
    return [path, `http://localhost:3001${path}`];
  }

  async getDashboard(): Promise<AdminDashboardData | null> {
    for (const url of this.getBaseUrls('/api/v1/admin/dashboard')) {
      try {
        const res = await fetch(url, { headers: this.getHeaders() });
        if (res.ok) {
          const data = await res.json();
          if (data.success) return data.data;
        }
      } catch (_) {}
    }
    return null;
  }

  async getUsers(params?: { query?: string; status?: string; role?: string }): Promise<AdminUserRecord[]> {
    const queryParams = new URLSearchParams();
    if (params?.query) queryParams.set('query', params.query);
    if (params?.status) queryParams.set('status', params.status);
    if (params?.role) queryParams.set('role', params.role);
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    for (const url of this.getBaseUrls(`/api/v1/admin/users${queryString}`)) {
      try {
        const res = await fetch(url, { headers: this.getHeaders() });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            return data.data;
          }
        }
      } catch (_) {}
    }
    return [];
  }

  async getUserDetails(id: number): Promise<any | null> {
    for (const url of this.getBaseUrls(`/api/v1/admin/users/${id}`)) {
      try {
        const res = await fetch(url, { headers: this.getHeaders() });
        if (res.ok) {
          const data = await res.json();
          if (data.success) return data.data;
        }
      } catch (_) {}
    }
    return null;
  }

  async updateUserStatus(id: number, status: string, reason?: string): Promise<boolean> {
    for (const url of this.getBaseUrls(`/api/v1/admin/users/${id}/status`)) {
      try {
        const res = await fetch(url, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify({ status, reason }),
        });
        if (res.ok) {
          const data = await res.json();
          return data.success === true;
        }
      } catch (_) {}
    }
    return false;
  }

  async updateUserRole(id: number, role: string): Promise<boolean> {
    for (const url of this.getBaseUrls(`/api/v1/admin/users/${id}/role`)) {
      try {
        const res = await fetch(url, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify({ role }),
        });
        if (res.ok) {
          const data = await res.json();
          return data.success === true;
        }
      } catch (_) {}
    }
    return false;
  }

  async creditUserWallet(id: number, amount: number, type: 'coins' | 'diamonds'): Promise<boolean> {
    for (const url of this.getBaseUrls(`/api/v1/admin/users/${id}/credit`)) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ amount, type }),
        });
        if (res.ok) {
          const data = await res.json();
          return data.success === true;
        }
      } catch (_) {}
    }
    return false;
  }

  async freezeUserWallet(id: number, frozen: boolean): Promise<boolean> {
    for (const url of this.getBaseUrls(`/api/v1/admin/users/${id}/freeze-wallet`)) {
      try {
        const res = await fetch(url, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify({ frozen }),
        });
        if (res.ok) {
          const data = await res.json();
          return data.success === true;
        }
      } catch (_) {}
    }
    return false;
  }

  async getAuditLogs(): Promise<any[]> {
    for (const url of this.getBaseUrls('/api/v1/admin/audit-logs')) {
      try {
        const res = await fetch(url, { headers: this.getHeaders() });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) return data.data;
        }
      } catch (_) {}
    }
    return [];
  }
}

export const adminApiClient = new AdminApiClient();
