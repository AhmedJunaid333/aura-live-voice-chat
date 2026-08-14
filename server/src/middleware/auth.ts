import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt.js';
import { prisma } from '../config/database.js';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Access token required. Please login.',
    });
    return;
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired access token. Please re-authenticate.',
    });
    return;
  }

  try {
    // Database-level verification: User existence and platform account status
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, numericId: true, username: true, role: true, status: true },
    });

    if (!dbUser) {
      res.status(401).json({
        success: false,
        error: 'User account not found or removed.',
      });
      return;
    }

    // Check account status: SUSPENDED, BLOCKED, BANNED
    if (dbUser.status === 'SUSPENDED' || dbUser.status === 'BLOCKED' || dbUser.status === 'BANNED') {
      // Check if there is an active temporary restriction that has expired
      const activeRestriction = await prisma.accountRestriction.findFirst({
        where: {
          userId: dbUser.id,
          status: 'ACTIVE',
        },
        orderBy: { createdAt: 'desc' },
      });

      if (activeRestriction && activeRestriction.expiresAt && new Date(activeRestriction.expiresAt) <= new Date()) {
        // Auto-expire temporary restriction
        await prisma.$transaction([
          prisma.accountRestriction.update({
            where: { id: activeRestriction.id },
            data: { status: 'EXPIRED' },
          }),
          prisma.user.update({
            where: { id: dbUser.id },
            data: { status: 'ACTIVE' },
          }),
          prisma.auditLog.create({
            data: {
              actorId: dbUser.id,
              actorRole: 'SYSTEM_AUTOPILOT',
              action: 'ACCOUNT_RESTRICTION_EXPIRED',
              resource: `User:${dbUser.numericId}`,
              details: `Temporary restriction automatically expired at ${activeRestriction.expiresAt.toISOString()}. Restored account status to ACTIVE.`,
            },
          }),
        ]);
        dbUser.status = 'ACTIVE';
      } else {
        res.status(403).json({
          success: false,
          code: 'ACCOUNT_SUSPENDED',
          error: `Your account is ${dbUser.status.toLowerCase()} by administration. Reason: ${activeRestriction?.reason || 'Platform security policy'}.`,
          reason: activeRestriction?.reason || 'Platform restriction',
          expiresAt: activeRestriction?.expiresAt ? activeRestriction.expiresAt.toISOString() : null,
        });
        return;
      }
    }

    req.user = {
      ...payload,
      role: dbUser.role,
    };
    next();
  } catch (err) {
    next(err);
  }
}

export async function optionalAuthenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (token) {
    const payload = verifyAccessToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
}

