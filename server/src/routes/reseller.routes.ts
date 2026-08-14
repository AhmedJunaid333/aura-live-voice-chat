import { Router } from 'express';
import { ResellerService } from '../services/reseller.service.js';
import {
  sendResellerInvitationSchema,
  submitResellerApplicationSchema,
  allocateCompanyDiamondsSchema,
  transferDiamondsSchema,
} from '../utils/validators.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { requireAdmin, requireReseller } from '../middleware/rbac.js';
import { prisma } from '../config/database.js';

export const resellerRouter = Router();

// Admin: Send Reseller Invitation
resellerRouter.post('/invitations', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = sendResellerInvitationSchema.parse(req.body);
    const result = await ResellerService.sendInvitation({
      targetNumericId: validated.targetUserId,
      adminUserId: req.user!.userId,
      type: validated.type,
      message: validated.message,
      requirements: validated.requirements,
      benefits: validated.benefits,
      expiryDays: validated.expiryDays,
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// User: Submit Reseller Application Form
resellerRouter.post('/applications', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = submitResellerApplicationSchema.parse(req.body);
    const result = await ResellerService.submitApplication({
      userId: req.user!.userId,
      invitationCode: validated.invitationCode,
      applicantName: validated.applicantName,
      phone: validated.phone,
      email: validated.email,
      country: validated.country,
      city: validated.city,
      businessNotes: validated.businessNotes,
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Admin: Approve Application & Activate Reseller
resellerRouter.put('/applications/:id/approve', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await ResellerService.approveAndActivateReseller(req.params.id as string, req.user!.userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});


// Admin: Allocate Company Diamonds (COMPANY_TO_RESELLER)
resellerRouter.post('/allocate', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = allocateCompanyDiamondsSchema.parse(req.body);
    const result = await ResellerService.allocateCompanyDiamonds({
      resellerNumericId: validated.resellerUserId,
      amount: validated.amount,
      notes: validated.notes,
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Reseller: Transfer Diamonds to User (RESELLER_TO_USER)
resellerRouter.post('/transfer', authenticateToken, requireReseller, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = transferDiamondsSchema.parse(req.body);
    const result = await ResellerService.transferDiamondsToUser({
      resellerUserId: req.user!.userId,
      targetNumericId: validated.targetUserId,
      amount: validated.amount,
      notes: validated.notes,
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Reseller: Get Reseller Ledger & Account Details
resellerRouter.get('/portal', authenticateToken, requireReseller, async (req: AuthenticatedRequest, res, next) => {
  try {
    const resellerAccount = await prisma.resellerAccount.findUnique({
      where: { userId: req.user!.userId },
      include: {
        user: true,
      },
    });
    res.status(200).json({ success: true, data: resellerAccount });
  } catch (error) {
    next(error);
  }
});

// 💎 Public / Wallet: Get all Active & Verified Coinsellors
resellerRouter.get('/active-coinsellors', async (req, res, next) => {
  try {
    const coinsellors = await ResellerService.getActiveCoinsellors();
    res.status(200).json({
      success: true,
      data: coinsellors,
      total: coinsellors.length,
    });
  } catch (error) {
    next(error);
  }
});

// 💎 Admin / Reseller: Update Coinsellor Profile & Settings
resellerRouter.put('/coinsellors/:numericId', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const numericId = parseInt(req.params.numericId as string, 10);
    const {
      displayName,
      whatsappNumber,
      phone,
      startingRate,
      minPurchase,
      paymentMethods,
      packages,
      status,
      operatingInfo,
      displayOrder,
    } = req.body;

    const user = await prisma.user.findUnique({
      where: { numericId },
      include: { resellerAccount: true },
    });

    if (!user || !user.resellerAccount) {
      return res.status(404).json({ success: false, message: 'Coinsellor not found.' });
    }

    const updatedAccount = await prisma.resellerAccount.update({
      where: { id: user.resellerAccount.id },
      data: {
        displayName: displayName ?? user.resellerAccount.displayName,
        whatsappNumber: whatsappNumber ?? user.resellerAccount.whatsappNumber,
        phone: phone ?? user.resellerAccount.phone,
        startingRate: startingRate ?? user.resellerAccount.startingRate,
        minPurchase: minPurchase ? parseInt(minPurchase, 10) : user.resellerAccount.minPurchase,
        paymentMethods: paymentMethods ?? user.resellerAccount.paymentMethods,
        packages: typeof packages === 'object' ? JSON.stringify(packages) : packages ?? user.resellerAccount.packages,
        status: status ?? user.resellerAccount.status,
        operatingInfo: operatingInfo ?? user.resellerAccount.operatingInfo,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : user.resellerAccount.displayOrder,
      },
    });

    res.status(200).json({ success: true, data: updatedAccount });
  } catch (error) {
    next(error);
  }
});
