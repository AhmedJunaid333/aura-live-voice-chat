// Admin Auth Controller (/api/v1/admin/auth)
export class AdminAuthController {
  async login(body: { username: string; password: string; twoFactorCode?: string }) {
    if (body.username === 'superadmin' && body.password === 'admin123') {
      return {
        success: true,
        accessToken: 'mock_admin_jwt_super_admin',
        admin: {
          id: 'adm-001',
          username: 'superadmin',
          role: 'SUPER_ADMIN',
          countryCode: null,
          permissions: ['*']
        }
      };
    }
    throw new Error('Invalid admin credentials');
  }
}
