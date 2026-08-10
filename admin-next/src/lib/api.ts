const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface UserRecord {
  id: number;
  numericId: number;
  username: string;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
  bio?: string | null;
  gender?: string | null;
  country?: string | null;
  level: number;
  vipTier: number;
  coins: number;
  diamonds: number;
  role: string;
  status: string;
  walletFrozen: boolean;
  createdAt: string;
}

export const adminApi = {
  async getDashboard() {
    try {
      const res = await fetch(`${BASE_URL}/admin/dashboard`, { cache: 'no-store' });
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  },

  async getUsers(params?: { query?: string; status?: string }) {
    try {
      const q = new URLSearchParams();
      if (params?.query) q.append('query', params.query);
      if (params?.status) q.append('status', params.status);
      const res = await fetch(`${BASE_URL}/admin/users?${q.toString()}`, { cache: 'no-store' });
      const json = await res.json();
      return (json.data || []) as UserRecord[];
    } catch {
      return [];
    }
  },

  async getUserDetails(id: number) {
    try {
      const res = await fetch(`${BASE_URL}/admin/users/${id}`, { cache: 'no-store' });
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  },

  async updateUserStatus(id: number, status: string, reason?: string) {
    try {
      const res = await fetch(`${BASE_URL}/admin/users/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason }),
      });
      return await res.json();
    } catch {
      return { success: false };
    }
  },

  async freezeWallet(id: number, walletFrozen: boolean, reason?: string) {
    try {
      const res = await fetch(`${BASE_URL}/admin/users/${id}/freeze-wallet`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletFrozen, reason }),
      });
      return await res.json();
    } catch {
      return { success: false };
    }
  },

  async creditWallet(id: number, amount: number, currency: 'coins' | 'diamonds') {
    try {
      const res = await fetch(`${BASE_URL}/admin/users/${id}/credit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency }),
      });
      return await res.json();
    } catch {
      return { success: false };
    }
  },

  async getAuditLogs() {
    try {
      const res = await fetch(`${BASE_URL}/admin/audit-logs`, { cache: 'no-store' });
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },
};
