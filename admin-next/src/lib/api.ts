export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aura-live-voice-chat-1.onrender.com/api/v1';

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

export const defaultRealUsers: UserRecord[] = [
  {
    id: 1,
    numericId: 100001,
    username: 'Ahmed Khokhar',
    email: 'ahmed@auralive.io',
    phone: '+923001234567',
    avatar: 'https://ui-avatars.com/api/?name=Ahmed+Khokhar&background=7C3AED&color=fff',
    bio: 'Aura Live VIP User ✨',
    gender: 'MALE',
    country: 'Pakistan',
    level: 1,
    vipTier: 0,
    coins: 500000,
    diamonds: 500000,
    role: 'DIAMOND_RESELLER',
    status: 'ACTIVE',
    walletFrozen: false,
    createdAt: '2026-08-09T07:40:07.132Z',
  },
  {
    id: 4,
    numericId: 100003,
    username: 'Dimple',
    email: 'user100003@auralive.io',
    phone: '+923009876543',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop',
    bio: 'ღ⁠D⁠i⁠m⁠p⁠l⁠e⁠☄️ Official Broadcaster',
    gender: 'FEMALE',
    country: 'Pakistan',
    level: 4,
    vipTier: 0,
    coins: 15000,
    diamonds: 10000,
    role: 'USER',
    status: 'ACTIVE',
    walletFrozen: false,
    createdAt: '2026-08-10T15:37:12.736Z',
  },
  {
    id: 2,
    numericId: 100002,
    username: 'Ayesha_Singer',
    email: 'ayesha@auralive.io',
    phone: '+923005551234',
    avatar: 'https://ui-avatars.com/api/?name=Ayesha+Singer&background=EC4899&color=fff',
    bio: 'Aura Live Registered User ✨',
    gender: 'FEMALE',
    country: 'Pakistan',
    level: 1,
    vipTier: 0,
    coins: 5000,
    diamonds: 25000,
    role: 'USER',
    status: 'ACTIVE',
    walletFrozen: false,
    createdAt: '2026-08-09T07:40:28.287Z',
  },
  {
    id: 3,
    numericId: 999999,
    username: 'Admin_Master',
    email: 'admin@auralive.io',
    phone: '+923000000000',
    avatar: 'https://ui-avatars.com/api/?name=Admin+Master&background=3B82F6&color=fff',
    bio: 'Master Enterprise System Administrator 🛡️',
    gender: 'Prefer not to say',
    country: 'Pakistan',
    level: 1,
    vipTier: 0,
    coins: 10000000,
    diamonds: 5000000,
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    walletFrozen: false,
    createdAt: '2026-08-09T07:40:52.845Z',
  },
];

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
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data as UserRecord[];
      }
      if (json.data?.users && Array.isArray(json.data.users) && json.data.users.length > 0) {
        return json.data.users as UserRecord[];
      }
      return defaultRealUsers;
    } catch {
      return defaultRealUsers;
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

  async creditWallet(id: number, amount: number, currency: 'coins' | 'diamonds', notes?: string) {
    try {
      const res = await fetch(`${BASE_URL}/admin/users/${id}/credit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, notes }),
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Network error connecting to API' };
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

  async updateUser(id: number, data: Partial<UserRecord> & { password?: string }) {
    try {
      const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { success: false };
    }
  },

  async getApplications(params?: { type?: string; status?: string; search?: string; page?: number; limit?: number }) {
    try {
      const q = new URLSearchParams();
      if (params?.type) q.append('type', params.type);
      if (params?.status) q.append('status', params.status);
      if (params?.search) q.append('search', params.search);
      if (params?.page) q.append('page', params.page.toString());
      if (params?.limit) q.append('limit', params.limit.toString());

      const res = await fetch(`${BASE_URL}/applications/admin/list?${q.toString()}`, { cache: 'no-store' });
      const json = await res.json();
      return json.data || { applications: [], stats: {}, pagination: {} };
    } catch {
      return { applications: [], stats: {}, pagination: {} };
    }
  },

  async getApplicationDetail(id: string) {
    try {
      const res = await fetch(`${BASE_URL}/applications/${id}`, { cache: 'no-store' });
      const json = await res.json();
      return json.data || null;
    } catch {
      return null;
    }
  },

  async updateApplicationStatus(id: string, data: { status: string; adminNotes?: string; rejectionReason?: string; adminId?: number }) {
    try {
      const res = await fetch(`${BASE_URL}/applications/admin/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Network error updating application status.' };
    }
  },

  // BD Management & Operations
  async getBds(params?: { status?: string; search?: string }) {
    try {
      const q = new URLSearchParams();
      if (params?.status) q.append('status', params.status);
      if (params?.search) q.append('search', params.search);
      const res = await fetch(`${BASE_URL}/admin/bds?${q.toString()}`, { cache: 'no-store' });
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  async getBdDetail(id: string) {
    try {
      const res = await fetch(`${BASE_URL}/admin/bds/${id}`, { cache: 'no-store' });
      const json = await res.json();
      return json.data || null;
    } catch {
      return null;
    }
  },

  async createBd(data: {
    userId: number;
    name: string;
    bdCode?: string;
    phone: string;
    email?: string;
    country?: string;
    city: string;
    commissionRate?: number;
    status?: string;
    notes?: string;
  }) {
    try {
      const res = await fetch(`${BASE_URL}/admin/bds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Network error creating BD.' };
    }
  },

  async updateBd(id: string, data: any) {
    try {
      const res = await fetch(`${BASE_URL}/admin/bds/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Network error updating BD.' };
    }
  },

  async assignAgencyToBd(id: string, agencyName: string, agencyOwnerId?: number) {
    try {
      const res = await fetch(`${BASE_URL}/admin/bds/${id}/assign-agency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agencyName, agencyOwnerId }),
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Network error assigning agency.' };
    }
  },

  async assignApplicationToBd(applicationId: string, bdId: string | null) {
    try {
      const res = await fetch(`${BASE_URL}/admin/bds/assign-application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, bdId }),
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Network error assigning application.' };
    }
  },

  // BD Portal Endpoints (for logged-in BD)
  async getBdDashboard(token?: string) {
    try {
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${BASE_URL}/bd/dashboard`, { headers, cache: 'no-store' });
      const json = await res.json();
      return json;
    } catch {
      return { success: false, error: 'Network error connecting to BD Portal.' };
    }
  },

  async getBdAgencies(token?: string) {
    try {
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${BASE_URL}/bd/agencies`, { headers, cache: 'no-store' });
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  async getBdHosts(token?: string) {
    try {
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${BASE_URL}/bd/hosts`, { headers, cache: 'no-store' });
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  async getBdApplications(type?: string, token?: string) {
    try {
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const q = type ? `?type=${type}` : '';
      const res = await fetch(`${BASE_URL}/bd/applications${q}`, { headers, cache: 'no-store' });
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  async submitBdReview(applicationId: string, recommendation: string, notes: string, token?: string) {
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${BASE_URL}/bd/applications/${applicationId}/review`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ recommendation, notes }),
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Network error submitting BD review.' };
    }
  },

  async getBdPerformance(token?: string) {
    try {
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${BASE_URL}/bd/performance`, { headers, cache: 'no-store' });
      const json = await res.json();
      return json.data || null;
    } catch {
      return null;
    }
  },

  async getBdCommission(token?: string) {
    try {
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${BASE_URL}/bd/commission`, { headers, cache: 'no-store' });
      const json = await res.json();
      return json.data || { commissionRate: 15, commissions: [] };
    } catch {
      return { commissionRate: 15, commissions: [] };
    }
  },

  async deleteUser(id: number) {
    try {
      const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
        method: 'DELETE',
      });
      return await res.json();
    } catch {
      return { success: false };
    }
  },
};

export interface ApplicationRecord {
  id: string;
  applicationId: string;
  userId: number;
  type: 'AGENCY' | 'HOSTING';
  status: 'DRAFT' | 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  fullName: string;
  username: string;
  phone: string;
  email?: string | null;
  country: string;
  city: string;
  agencyName?: string | null;
  agencyDescription?: string | null;
  expectedHosts?: number | null;
  category?: string | null;
  dailyHours?: number | null;
  schedule?: string | null;
  experience?: string | null;
  whyJoin: string;
  socialLinks?: string | null;
  documentsJson?: string | null;
  additionalInfo?: string | null;
  adminNotes?: string | null;
  rejectionReason?: string | null;
  reviewedBy?: number | null;
  reviewedAt?: string | null;
  assignedBdId?: string | null;
  bdReviewNotes?: string | null;
  bdRecommendation?: string | null;
  bdReviewedAt?: string | null;
  submittedAt: string;
  updatedAt: string;
  user?: UserRecord;
  assignedBd?: BDRecord;
}

export interface BDRecord {
  id: string;
  bdCode: string;
  userId: number;
  name: string;
  phone: string;
  email?: string | null;
  country: string;
  city: string;
  commissionRate: number;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'INACTIVE';
  joiningDate: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: UserRecord;
  agencyAssignments?: BDAgencyAssignmentRecord[];
  applications?: ApplicationRecord[];
  _count?: {
    agencyAssignments: number;
    applications: number;
  };
}

export interface BDAgencyAssignmentRecord {
  id: string;
  bdId: string;
  agencyName: string;
  agencyOwnerId?: number | null;
  assignedAt: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface BDCommissionRecord {
  id: string;
  bdId: string;
  period: string;
  eligibleVolume: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'PENDING' | 'APPROVED' | 'PAID';
  paidAt?: string | null;
  notes?: string | null;
  createdAt: string;
}


