export type AdminRoleCode =
  | 'SUPER_ADMIN'
  | 'COUNTRY_MANAGER'
  | 'OPERATIONS_MANAGER'
  | 'FINANCE_MANAGER'
  | 'MODERATOR'
  | 'SUPPORT_AGENT';

export interface AdminUser {
  id: string;
  username: string;
  roleCode: AdminRoleCode;
  countryCode?: string | null;
  permissions: Set<string>;
}

export class RbacService {
  private rolePermissions: Map<AdminRoleCode, Set<string>> = new Map();

  constructor() {
    // 1. SUPER_ADMIN (Full Access)
    this.rolePermissions.set('SUPER_ADMIN', new Set(['*']));

    // 2. COUNTRY_MANAGER (Scoped to Country)
    this.rolePermissions.set(
      'COUNTRY_MANAGER',
      new Set(['users.view', 'agency.view', 'analytics.country_view', 'live.monitor'])
    );

    // 3. OPERATIONS_MANAGER
    this.rolePermissions.set(
      'OPERATIONS_MANAGER',
      new Set(['users.view', 'users.edit', 'users.ban', 'live.monitor', 'live.terminate', 'gift.manage'])
    );

    // 4. FINANCE_MANAGER
    this.rolePermissions.set(
      'FINANCE_MANAGER',
      new Set(['users.view', 'wallet.view', 'withdraw.approve', 'withdraw.reject', 'recharge.manage'])
    );

    // 5. MODERATOR
    this.rolePermissions.set(
      'MODERATOR',
      new Set(['users.view', 'users.ban', 'live.monitor', 'live.mute', 'reports.review'])
    );

    // 6. SUPPORT_AGENT
    this.rolePermissions.set('SUPPORT_AGENT', new Set(['users.view', 'reports.view']));
  }

  hasPermission(admin: AdminUser, requiredPermission: string): boolean {
    if (admin.roleCode === 'SUPER_ADMIN') return true;
    const permissions = this.rolePermissions.get(admin.roleCode);
    return permissions ? permissions.has(requiredPermission) : false;
  }

  enforceCountryScope<T extends { countryCode?: string | null }>(admin: AdminUser, items: T[]): T[] {
    if (admin.roleCode === 'SUPER_ADMIN' || !admin.countryCode) return items;
    return items.filter(item => item.countryCode === admin.countryCode);
  }
}
