import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';
import { prisma } from '../config/database.js';

// Central Role Hierarchy Definitions
export type PlatformRole =
  | 'SUPER_ADMIN_CEO'
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MODERATOR'
  | 'FINANCE_ADMIN'
  | 'OPERATIONS_ADMIN'
  | 'COUNTRY_HEAD'
  | 'BD_LEADER'
  | 'AGENCY_MANAGER'
  | 'MASTER_RESELLER'
  | 'DIAMOND_RESELLER'
  | 'COIN_SELLER'
  | 'HOST'
  | 'SUPPORT'
  | 'ANALYST'
  | 'USER';

// Role Permissions Map
export const ROLE_PERMISSIONS_MATRIX: Record<PlatformRole, string[]> = {
  SUPER_ADMIN_CEO: ['*'], // Full Root Master Access
  SUPER_ADMIN: [
    'portal.admin.view',
    'portal.users.view',
    'portal.users.edit',
    'portal.users.suspend',
    'portal.users.delete',
    'portal.wallet.view',
    'portal.wallet.manage',
    'portal.diamonds.view',
    'portal.diamonds.transfer',
    'portal.withdrawals.view',
    'portal.withdrawals.approve',
    'portal.reseller.view',
    'portal.reseller.approve',
    'portal.settings.manage',
    'portal.audit.view',
  ],
  ADMIN: [
    'portal.admin.view',
    'portal.users.view',
    'portal.users.edit',
    'portal.users.suspend',
    'portal.wallet.view',
    'portal.withdrawals.view',
    'portal.reseller.view',
    'portal.reports.manage',
    'portal.audit.view',
  ],
  MODERATOR: [
    'portal.admin.view',
    'portal.users.view',
    'portal.reports.manage',
    'portal.live.moderate',
    'portal.chat.moderate',
  ],
  FINANCE_ADMIN: [
    'portal.admin.view',
    'portal.wallet.view',
    'portal.wallet.manage',
    'portal.diamonds.view',
    'portal.withdrawals.view',
    'portal.withdrawals.approve',
    'portal.finance.export',
  ],
  OPERATIONS_ADMIN: [
    'portal.admin.view',
    'portal.users.view',
    'portal.hosts.manage',
    'portal.agencies.manage',
    'portal.live.view',
  ],
  COUNTRY_HEAD: [
    'portal.admin.view',
    'portal.territory.view',
    'portal.hosts.view',
    'portal.reseller.view',
  ],
  BD_LEADER: [
    'portal.bd.view',
    'portal.hosts.view',
    'portal.agencies.view',
  ],
  AGENCY_MANAGER: [
    'portal.agency.view',
    'portal.agency.hosts.view',
    'portal.agency.earnings.view',
  ],
  MASTER_RESELLER: [
    'portal.reseller.view',
    'portal.reseller.transfer',
    'portal.subresellers.manage',
  ],
  DIAMOND_RESELLER: [
    'portal.reseller.view',
    'portal.reseller.transfer',
  ],
  COIN_SELLER: [
    'portal.coinseller.view',
    'portal.withdrawals.process',
  ],
  HOST: [
    'portal.host.view',
    'portal.host.earnings.view',
  ],
  SUPPORT: [
    'portal.users.view',
    'portal.tickets.manage',
  ],
  ANALYST: [
    'portal.analytics.view',
    'portal.reports.view',
  ],
  USER: [
    'portal.app.access',
  ],
};

// Middleware: Require Allowed Roles
export function requireRoles(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required. Missing token.' });
      return;
    }

    const userRole = (req.user.role || 'USER').toUpperCase();
    if (userRole === 'SUPER_ADMIN_CEO' || userRole === 'SUPER_ADMIN') {
      return next(); // CEO / Super Admin bypasses role checks
    }

    if (!allowedRoles.map(r => r.toUpperCase()).includes(userRole)) {
      res.status(403).json({
        success: false,
        error: `Forbidden. Role '${userRole}' is not authorized for this resource.`,
      });
      return;
    }

    next();
  };
}

// Middleware: Require Granular Permission Scope
export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required.' });
      return;
    }

    const userRole = (req.user.role || 'USER').toUpperCase() as PlatformRole;
    const permissions = ROLE_PERMISSIONS_MATRIX[userRole] || [];

    if (permissions.includes('*') || permissions.includes(permission)) {
      return next();
    }

    res.status(403).json({
      success: false,
      error: `Forbidden. Permission '${permission}' required for this action.`,
    });
  };
}

// Resource Ownership Verification Middleware Helper
export async function verifyResourceOwnership(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
  resourceUserId: number
): Promise<boolean> {
  if (!req.user) return false;

  const currentUserId = req.user.userId;
  const userRole = (req.user.role || 'USER').toUpperCase();

  // Admins & CEO have global ownership
  if (['SUPER_ADMIN_CEO', 'SUPER_ADMIN', 'ADMIN'].includes(userRole)) {
    return true;
  }

  // Users can only manage their own resource
  if (currentUserId === resourceUserId) {
    return true;
  }

  // Strict ownership violation
  res.status(403).json({
    success: false,
    error: 'Access Denied: You do not own this resource or data entity.',
  });
  return false;
}

export const requireAdmin = requireRoles('ADMIN', 'SUPER_ADMIN', 'SUPER_ADMIN_CEO');
export const requireReseller = requireRoles('DIAMOND_RESELLER', 'MASTER_RESELLER', 'ADMIN', 'SUPER_ADMIN', 'SUPER_ADMIN_CEO');
export const requireHost = requireRoles('HOST', 'ADMIN', 'SUPER_ADMIN', 'SUPER_ADMIN_CEO');
