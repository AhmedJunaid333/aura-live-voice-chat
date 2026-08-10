import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';

export function requireRoles(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`,
      });
      return;
    }

    next();
  };
}

export const requireAdmin = requireRoles('ADMIN', 'SUPER_ADMIN');
export const requireReseller = requireRoles('DIAMOND_RESELLER', 'MASTER_RESELLER', 'ADMIN', 'SUPER_ADMIN');
export const requireHost = requireRoles('HOST', 'ADMIN', 'SUPER_ADMIN');
