import { Router, Request, Response } from 'express';
import { BdService } from '../services/bd.service.js';

export const adminBdRouter = Router();

/**
 * GET /api/v1/admin/bds
 * Admin: List all BDs
 */
adminBdRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search } = req.query;
    const bds = await BdService.getAllBds({
      status: status as string,
      search: search as string,
    });
    res.status(200).json({ success: true, data: bds });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to list BDs.' });
  }
});

/**
 * POST /api/v1/admin/bds
 * Admin: Create new BD for existing user
 */
adminBdRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, name, bdCode, phone, email, country, city, commissionRate, status, notes } = req.body;

    if (!userId || !name || !phone || !city) {
      res.status(400).json({
        success: false,
        error: 'Target User ID, BD Name, Phone, and City are required.',
      });
      return;
    }

    const created = await BdService.createBd({
      userId: Number(userId),
      name,
      bdCode,
      phone,
      email,
      country,
      city,
      commissionRate: commissionRate ? Number(commissionRate) : 15.0,
      status,
      notes,
    });

    res.status(201).json({
      success: true,
      message: `BD ${created.bdCode} created and activated successfully.`,
      data: created,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to create BD.' });
  }
});

/**
 * GET /api/v1/admin/bds/:id
 * Admin: Get single BD details
 */
adminBdRouter.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const bd = await BdService.getBdById(id);
    res.status(200).json({ success: true, data: bd });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to fetch BD details.' });
  }
});

/**
 * PATCH /api/v1/admin/bds/:id
 * Admin: Update BD record
 */
adminBdRouter.patch('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, phone, email, city, country, commissionRate, status, notes } = req.body;

    const updated = await BdService.updateBd(id, {
      name,
      phone,
      email,
      city,
      country,
      commissionRate,
      status,
      notes,
    });

    res.status(200).json({
      success: true,
      message: 'BD updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to update BD.' });
  }
});

/**
 * POST /api/v1/admin/bds/:id/assign-agency
 * Admin: Assign agency to BD
 */
adminBdRouter.post('/:id/assign-agency', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { agencyName, agencyOwnerId } = req.body;

    if (!agencyName) {
      res.status(400).json({ success: false, error: 'Agency name is required.' });
      return;
    }

    const assignment = await BdService.assignAgencyToBd(id, agencyName, agencyOwnerId ? Number(agencyOwnerId) : undefined);
    res.status(200).json({
      success: true,
      message: `Agency ${agencyName} assigned to BD successfully.`,
      data: assignment,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to assign agency to BD.' });
  }
});

/**
 * POST /api/v1/admin/bds/assign-application
 * Admin: Assign application to BD
 */
adminBdRouter.post('/assign-application', async (req: Request, res: Response): Promise<void> => {
  try {
    const { applicationId, bdId } = req.body;

    if (!applicationId) {
      res.status(400).json({ success: false, error: 'Application ID is required.' });
      return;
    }

    const updated = await BdService.assignApplicationToBd(applicationId, bdId || null);
    res.status(200).json({
      success: true,
      message: bdId ? 'Application assigned to BD for review.' : 'Application unassigned from BD.',
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to assign application to BD.' });
  }
});
