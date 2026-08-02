import { RbacService, AdminUser } from '../src/modules/admin/rbac.service.js';

async function runRbacTests() {
  console.log('🧪 Starting Test: Role-Based Access Control & Country Scope Isolation...');

  const rbac = new RbacService();

  const superAdmin: AdminUser = { id: 'a-1', username: 'admin_super', roleCode: 'SUPER_ADMIN', countryCode: null, permissions: new Set(['*']) };
  const countryManagerPK: AdminUser = { id: 'a-2', username: 'mgr_pk', roleCode: 'COUNTRY_MANAGER', countryCode: 'PK', permissions: new Set() };
  const financeManager: AdminUser = { id: 'a-3', username: 'mgr_fin', roleCode: 'FINANCE_MANAGER', countryCode: null, permissions: new Set() };

  // Test 1: SuperAdmin has all permissions
  console.assert(rbac.hasPermission(superAdmin, 'wallet.adjust') === true, 'SuperAdmin permission failed');

  // Test 2: Country Manager permissions check
  console.assert(rbac.hasPermission(countryManagerPK, 'users.view') === true, 'Country Manager view permission failed');
  console.assert(rbac.hasPermission(countryManagerPK, 'wallet.adjust') === false, 'Country Manager should NOT adjust wallet');

  // Test 3: Finance Manager permissions check
  console.assert(rbac.hasPermission(financeManager, 'withdraw.approve') === true, 'Finance Manager withdraw approval missing');
  console.assert(rbac.hasPermission(financeManager, 'live.terminate') === false, 'Finance Manager should NOT terminate live rooms');

  // Test 4: Country Scope Filtering
  const mockUsers = [
    { id: 'u-1', countryCode: 'PK' },
    { id: 'u-2', countryCode: 'IN' },
    { id: 'u-3', countryCode: 'PK' }
  ];

  const pkScopedUsers = rbac.enforceCountryScope(countryManagerPK, mockUsers);
  console.assert(pkScopedUsers.length === 2, 'Country Manager scope isolation failed');
  console.assert(pkScopedUsers.every(u => u.countryCode === 'PK'), 'Foreign country user leaked into scoped query');

  console.log('✅ RBAC & Country Scope Isolation Tests PASSED!\n');
}

runRbacTests().catch(console.error);
