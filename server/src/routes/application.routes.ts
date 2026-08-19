import { Router, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { ApplicationService } from '../services/application.service.js';

export const applicationRouter = Router();

/**
 * GET /api/v1/applications/my
 * Get current user's submitted applications
 */
applicationRouter.get('/my', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized.' });
      return;
    }

    const data = await ApplicationService.getMyApplications(userId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to fetch user applications.' });
  }
});

/**
 * POST /api/v1/applications
 * Submit a new Agency or Hosting application
 */
applicationRouter.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized.' });
      return;
    }

    const {
      type,
      fullName,
      phone,
      email,
      country,
      city,
      agencyName,
      agencyDescription,
      expectedHosts,
      category,
      dailyHours,
      schedule,
      experience,
      whyJoin,
      socialLinks,
      documentsJson,
      additionalInfo,
    } = req.body;

    if (!type || !['AGENCY', 'HOSTING'].includes(type.toUpperCase())) {
      res.status(400).json({ success: false, error: 'Valid application type (AGENCY or HOSTING) is required.' });
      return;
    }

    if (!fullName || !phone || !city || !whyJoin) {
      res.status(400).json({ success: false, error: 'Full Name, Phone, City, and Statement of Purpose (Why Join) are required.' });
      return;
    }

    if (type.toUpperCase() === 'AGENCY') {
      if (!agencyName || !agencyDescription) {
        res.status(400).json({ success: false, error: 'Agency Name and Agency Description are required for Agency applications.' });
        return;
      }
    }

    const application = await ApplicationService.createApplication(userId, {
      type: type.toUpperCase() as 'AGENCY' | 'HOSTING',
      fullName,
      phone,
      email,
      country,
      city,
      agencyName,
      agencyDescription,
      expectedHosts,
      category,
      dailyHours,
      schedule,
      experience,
      whyJoin,
      socialLinks,
      documentsJson,
      additionalInfo,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      data: application,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to submit application.' });
  }
});

/**
 * GET /api/v1/applications/admin/list
 * Admin: Get all applications with filters
 */
applicationRouter.get('/admin/list', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { type, status, search, page, limit } = req.query;

    const data = await ApplicationService.getAdminApplications({
      type: type as string,
      status: status as string,
      search: search as string,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 20,
    });

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to fetch admin applications.' });
  }
});

/**
 * PATCH /api/v1/applications/admin/:id/status
 * Admin: Update application status (Approve, Reject, Under Review, Cancel)
 */
applicationRouter.patch('/admin/:id/status', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status, adminNotes, rejectionReason, adminId } = req.body;

    if (!status || !['APPROVED', 'REJECTED', 'UNDER_REVIEW', 'CANCELLED'].includes(status.toUpperCase())) {
      res.status(400).json({ success: false, error: 'Valid status (APPROVED, REJECTED, UNDER_REVIEW, CANCELLED) is required.' });
      return;
    }

    const effectiveAdminId = adminId ? parseInt(adminId, 10) : (req.user?.userId || 1);

    const updated = await ApplicationService.updateApplicationStatus(
      id,
      effectiveAdminId,
      status.toUpperCase() as any,
      adminNotes,
      rejectionReason,
    );

    res.status(200).json({
      success: true,
      message: `Application ${status.toLowerCase()} successfully.`,
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to update application status.' });
  }
});

/**
 * GET /api/v1/applications/:id
 * Get single application details
 */
applicationRouter.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 0;
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'SUPER_ADMIN_CEO'].includes(req.user?.role || '');
    const id = req.params.id as string;

    const application = await ApplicationService.getApplicationById(id, userId, isAdmin);
    res.status(200).json({ success: true, data: application });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to fetch application details.' });
  }
});
