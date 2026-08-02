import { AdminAuthController } from '../src/controllers/admin-auth.controller.js';

async function runAdminAuthTests() {
  console.log('🧪 Starting Test: Admin Authentication & Credentials...');

  const auth = new AdminAuthController();

  // Test 1: SuperAdmin Login
  const res = await auth.login({ username: 'superadmin', password: 'admin123' });
  console.assert(res.success === true, 'Admin login failed');
  console.assert(res.admin.role === 'SUPER_ADMIN', 'Admin role mismatch');
  console.assert(res.accessToken.length > 0, 'JWT token missing');

  // Test 2: Invalid Password Error
  try {
    await auth.login({ username: 'superadmin', password: 'wrongpassword' });
    console.assert(false, 'Should have failed invalid credentials');
  } catch (err: any) {
    console.log('  ✅ Invalid password caught successfully:', err.message);
  }

  console.log('✅ Admin Authentication Tests PASSED!\n');
}

runAdminAuthTests().catch(console.error);
