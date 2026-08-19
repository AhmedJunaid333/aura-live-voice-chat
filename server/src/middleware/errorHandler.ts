import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  console.error(`❌ [API Error] ${req.method} ${req.url}:`, err);

  if (err instanceof ZodError) {
    const firstErr = err.errors[0];
    const fieldName = firstErr?.path?.join('.') || 'input';
    const cleanMsg = firstErr?.message ? `${fieldName}: ${firstErr.message}` : 'Validation failed';
    res.status(400).json({
      success: false,
      error: cleanMsg,
      message: cleanMsg,
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
}
