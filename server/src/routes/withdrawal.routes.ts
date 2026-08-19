import { Router, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { requireAdmin, requireReseller } from '../middleware/rbac.js';
import { WithdrawalService } from '../services/withdrawal.service.js';

export const withdrawalRouter = Router();

/**
 * 1. GET /api/v1/withdrawal/config
 * Public/User: Get current withdrawal configuration & rates
 */
withdrawalRouter.get('/config', async (_req, res: Response): Promise<void> => {
  try {
    const config = await WithdrawalService.getConfig();
    res.status(200).json({ success: true, data: config });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to fetch withdrawal configuration.' });
  }
});

/**
 * 2. GET /api/v1/withdrawal/resellers
 * User: Get active & verified Resellers for withdrawal selection
 */
withdrawalRouter.get('/resellers', async (_req, res: Response): Promise<void> => {
  try {
    const resellers = await WithdrawalService.getActiveResellers();
    res.status(200).json({ success: true, data: resellers, total: resellers.length });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to fetch resellers.' });
  }
});

// Backward compatibility alias for /sellers
withdrawalRouter.get('/sellers', async (_req, res: Response): Promise<void> => {
  try {
    const resellers = await WithdrawalService.getActiveResellers();
    res.status(200).json({ success: true, data: resellers, total: resellers.length });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to fetch sellers.' });
  }
});

/**
 * 3. GET /api/v1/withdrawal/official
 * User: Get enabled official withdrawal payment methods
 */
withdrawalRouter.get('/official', async (_req, res: Response): Promise<void> => {
  try {
    const providers = await WithdrawalService.getOfficialProviders();
    res.status(200).json({ success: true, data: providers });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to fetch official providers.' });
  }
});

/**
 * 4. POST /api/v1/withdrawal/preview
 * User: Server-side preview calculation of Beans -> USD & Fees
 */
withdrawalRouter.post('/preview', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { beansAmount, channel, providerId } = req.body;

    if (!beansAmount || !channel) {
      res.status(400).json({ success: false, error: 'Beans amount and channel (RESELLER | OFFICIAL) are required.' });
      return;
    }

    const preview = await WithdrawalService.previewWithdrawal({
      userId,
      beansAmount: Number(beansAmount),
      channel: channel as 'RESELLER' | 'OFFICIAL',
      providerId,
    });

    res.status(200).json({ success: true, data: preview });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to preview withdrawal calculation.' });
  }
});

/**
 * 5. POST /api/v1/withdrawal / POST /api/v1/withdrawal/request
 * User: Submit new withdrawal request with atomic balance reservation
 */
const handleCreateRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const {
      channel = 'RESELLER',
      sellerUserId,
      officialProvider,
      beansAmount,
      amount,
      paymentMethod,
      accountTitle,
      accountNumber,
      bankName,
      iban,
      idempotencyKey,
    } = req.body;

    const finalBeans = beansAmount ? Number(beansAmount) : amount ? Number(amount) : 0;

    if (!finalBeans || finalBeans <= 0) {
      res.status(400).json({ success: false, error: 'Valid Beans amount is required.' });
      return;
    }

    if (!paymentMethod || !accountTitle || !accountNumber) {
      res.status(400).json({ success: false, error: 'Payment method, Account Title, and Account Number are required.' });
      return;
    }

    const result = await WithdrawalService.createWithdrawalRequest({
      userId,
      channel: channel as 'RESELLER' | 'OFFICIAL',
      sellerUserId: sellerUserId ? Number(sellerUserId) : undefined,
      officialProvider,
      beansAmount: finalBeans,
      paymentMethod,
      accountTitle,
      accountNumber,
      bankName,
      iban,
      idempotencyKey,
    });

    res.status(result.isExisting ? 200 : 201).json({
      success: true,
      message: result.isExisting
        ? 'Existing withdrawal request returned (idempotency).'
        : `Withdrawal request #${result.withdrawal.requestNumber} created successfully! Available Beans placed on HOLD.`,
      data: result.withdrawal,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to create withdrawal request.' });
  }
};

withdrawalRouter.post('/', authenticateToken, handleCreateRequest);
withdrawalRouter.post('/request', authenticateToken, handleCreateRequest);

/**
 * 6. GET /api/v1/withdrawal/my
 * User: Get my withdrawal request history
 */
withdrawalRouter.get('/my', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const list = await WithdrawalService.getMyWithdrawals(userId);
    res.status(200).json({ success: true, data: list });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to fetch withdrawal history.' });
  }
});

// Backward compatibility alias for /requests
withdrawalRouter.get('/requests', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userRole = req.user?.role;
    const userId = req.user!.userId;

    if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
      const all = await WithdrawalService.getAdminWithdrawals();
      res.status(200).json({ success: true, data: all.requests });
    } else if (userRole === 'DIAMOND_RESELLER' || userRole === 'RESELLER' || userRole === 'MASTER_RESELLER') {
      const queue = await WithdrawalService.getResellerWithdrawals(userId);
      res.status(200).json({ success: true, data: queue });
    } else {
      const my = await WithdrawalService.getMyWithdrawals(userId);
      res.status(200).json({ success: true, data: my });
    }
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to fetch requests.' });
  }
});

/**
 * 7. GET /api/v1/withdrawal/reseller/queue
 * Reseller: Get assigned incoming withdrawal requests
 */
withdrawalRouter.get('/reseller/queue', authenticateToken, requireReseller, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const resellerUserId = req.user!.userId;
    const { status } = req.query;
    const queue = await WithdrawalService.getResellerWithdrawals(resellerUserId, status as string);
    res.status(200).json({ success: true, data: queue });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to fetch reseller withdrawal queue.' });
  }
});

/**
 * 8. POST /api/v1/withdrawal/reseller/:id/action
 * Reseller: Process, mark payment sent, complete, or reject request
 */
withdrawalRouter.post('/reseller/:id/action', authenticateToken, requireReseller, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const resellerUserId = req.user!.userId;
    const requestId = req.params.id as string;
    const { action, notes, paymentReference, paymentProof, rejectionReason } = req.body;

    if (!action || !['PROCESS', 'PAYMENT_SENT', 'COMPLETE', 'REJECT'].includes(action)) {
      res.status(400).json({ success: false, error: 'Valid action (PROCESS, PAYMENT_SENT, COMPLETE, REJECT) is required.' });
      return;
    }

    const updated = await WithdrawalService.processResellerWithdrawal(
      resellerUserId,
      requestId,
      action as any,
      { notes, paymentReference, paymentProof, rejectionReason }
    );

    res.status(200).json({
      success: true,
      message: `Withdrawal request action '${action}' completed successfully!`,
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to process reseller withdrawal action.' });
  }
});

/**
 * 9. GET /api/v1/withdrawal/admin/all
 * Admin: Get all withdrawal requests with filters & metrics
 */
withdrawalRouter.get('/admin/all', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { channel, status, search, limit, page } = req.query;
    const result = await WithdrawalService.getAdminWithdrawals({
      channel: channel as string,
      status: status as string,
      search: search as string,
      limit: limit ? Number(limit) : 50,
      page: page ? Number(page) : 1,
    });
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to fetch admin withdrawals.' });
  }
});

/**
 * 10. PATCH /api/v1/withdrawal/admin/config
 * Admin: Update withdrawal rates, limits, and channel settings
 */
withdrawalRouter.patch('/admin/config', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const updated = await WithdrawalService.updateConfig(req.body);
    res.status(200).json({
      success: true,
      message: 'Withdrawal configuration updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to update withdrawal configuration.' });
  }
});

/**
 * 11. POST /api/v1/withdrawal/admin/:id/action
 * Admin: Process Official or any withdrawal
 */
withdrawalRouter.post('/admin/:id/action', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const adminUserId = req.user?.userId || req.body.adminUserId || 1;
    const requestId = req.params.id as string;
    const { action, notes, paymentReference, paymentProof, rejectionReason } = req.body;

    if (!action || !['PROCESS', 'PAYMENT_SENT', 'COMPLETE', 'REJECT'].includes(action)) {
      res.status(400).json({ success: false, error: 'Valid action (PROCESS, PAYMENT_SENT, COMPLETE, REJECT) is required.' });
      return;
    }

    const updated = await WithdrawalService.processAdminWithdrawal(
      Number(adminUserId),
      requestId,
      action as any,
      { notes, paymentReference, paymentProof, rejectionReason }
    );

    res.status(200).json({
      success: true,
      message: `Admin action '${action}' applied to withdrawal request successfully!`,
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to execute admin action.' });
  }
});

// Backward compatibility alias for /process
withdrawalRouter.post('/process', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const userRole = req.user?.role;
    const { requestId, action, reason, paymentReference } = req.body;

    const standardAction = action === 'APPROVE' ? 'COMPLETE' : action;

    if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
      const updated = await WithdrawalService.processAdminWithdrawal(userId, requestId, standardAction, { rejectionReason: reason, paymentReference });
      res.status(200).json({ success: true, message: `Processed as Admin: ${action}`, data: updated });
    } else {
      const updated = await WithdrawalService.processResellerWithdrawal(userId, requestId, standardAction, { rejectionReason: reason, paymentReference });
      res.status(200).json({ success: true, message: `Processed as Reseller: ${action}`, data: updated });
    }
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to process request.' });
  }
});

/**
 * 12. GET /api/v1/withdrawal/:id
 * Get single withdrawal details
 */
withdrawalRouter.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const userRole = req.user?.role;
    const details = await WithdrawalService.getWithdrawalById(req.params.id as string, userId, userRole);
    res.status(200).json({ success: true, data: details });
  } catch (error: any) {
    res.status(403).json({ success: false, error: error.message || 'Failed to fetch withdrawal details.' });
  }
});
