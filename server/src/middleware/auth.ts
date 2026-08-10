import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt.js';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
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

  req.user = payload;
  next();
}
