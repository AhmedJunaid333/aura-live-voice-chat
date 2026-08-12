import { Router, Request, Response, NextFunction } from 'express';
import { FamilyService } from '../services/family.service.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

export const familyRouter = Router();

// -----------------------------------------------------------------------------
// 1. Discover & List Families
// -----------------------------------------------------------------------------
familyRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, country, page, limit } = req.query;
    const result = await FamilyService.listFamilies({
      search: search as string,
      country: country as string,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
    });
    res.status(200).json({ success: true, data: result.families, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// 2. Get Realtime Family Rankings
// -----------------------------------------------------------------------------
familyRouter.get('/rankings', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const period = (req.query.period as 'all' | 'weekly' | 'monthly') || 'all';
    const rankings = await FamilyService.getFamilyRankings(period);
    res.status(200).json({ success: true, data: rankings });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// 3. Get Logged-in User's Family
// -----------------------------------------------------------------------------
familyRouter.get('/my-family', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const membership = await FamilyService.getMyFamily(req.user!.userId);
    res.status(200).json({ success: true, data: membership });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// 4. Get My Pending Family Invitations
// -----------------------------------------------------------------------------
familyRouter.get('/invitations/me', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const invitations = await FamilyService.getMyInvitations(req.user!.userId);
    res.status(200).json({ success: true, data: invitations });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// 5. Respond to Invitation (Accept / Reject)
// -----------------------------------------------------------------------------
familyRouter.post('/invitations/:invitationId/respond', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { action } = req.body;
    if (!action || !['ACCEPTED', 'REJECTED'].includes(action)) {
      res.status(400).json({ success: false, error: 'VALIDATION_ERROR', message: 'Action must be ACCEPTED or REJECTED.' });
      return;
    }
    const result = await FamilyService.respondInvitation({
      invitationId: String(req.params.invitationId),
      userId: req.user!.userId,
      action,
    });
    res.status(200).json({ success: true, message: `Invitation ${action.toLowerCase()} successfully!`, data: result });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// 6. Create Family (Authenticated Owner)
// -----------------------------------------------------------------------------
familyRouter.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, rules, logo, icon, country } = req.body;
    if (!name || name.trim().length < 3) {
      res.status(400).json({ success: false, error: 'VALIDATION_ERROR', message: 'Family name must be at least 3 characters long.' });
      return;
    }
    const result = await FamilyService.createFamily({
      ownerId: req.user!.userId,
      name,
      description,
      rules,
      logo,
      icon,
      country,
    });
    res.status(201).json({ success: true, message: 'Family created successfully! 👑', data: result });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// 7. Get Family Profile Details
// -----------------------------------------------------------------------------
familyRouter.get('/:familyId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const family = await FamilyService.getFamilyProfile(String(req.params.familyId));
    res.status(200).json({ success: true, data: family });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// 8. Invite a User to Family
// -----------------------------------------------------------------------------
familyRouter.post('/:familyId/invite', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { targetUserId } = req.body;
    if (!targetUserId) {
      res.status(400).json({ success: false, error: 'VALIDATION_ERROR', message: 'targetUserId is required.' });
      return;
    }
    const invitation = await FamilyService.inviteMember({
      familyId: String(req.params.familyId),
      inviterId: req.user!.userId,
      targetUserId: Number(targetUserId),
    });
    res.status(201).json({ success: true, message: 'Invitation sent successfully! 💌', data: invitation });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// 9. Leave Family
// -----------------------------------------------------------------------------
familyRouter.post('/:familyId/leave', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await FamilyService.leaveFamily({
      familyId: String(req.params.familyId),
      userId: req.user!.userId,
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// 10. Update Member Role (Promote / Demote)
// -----------------------------------------------------------------------------
familyRouter.post('/:familyId/members/:userId/role', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { newRole } = req.body;
    if (!newRole || !['ADMIN', 'CO_ADMIN', 'HOST', 'MEMBER'].includes(newRole)) {
      res.status(400).json({ success: false, error: 'VALIDATION_ERROR', message: 'Invalid role. Must be ADMIN, CO_ADMIN, HOST, or MEMBER.' });
      return;
    }
    const updated = await FamilyService.updateMemberRole({
      familyId: String(req.params.familyId),
      actorId: req.user!.userId,
      targetUserId: parseInt(String(req.params.userId), 10),
      newRole,
    });
    res.status(200).json({ success: true, message: `Member role updated to ${newRole}! 🛡️`, data: updated });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// 11. Kick Member
// -----------------------------------------------------------------------------
familyRouter.post('/:familyId/members/:userId/remove', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { reason } = req.body;
    const result = await FamilyService.removeMember({
      familyId: String(req.params.familyId),
      actorId: req.user!.userId,
      targetUserId: parseInt(String(req.params.userId), 10),
      reason,
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// 12. Ban Member
// -----------------------------------------------------------------------------
familyRouter.post('/:familyId/members/:userId/ban', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { reason } = req.body;
    const result = await FamilyService.banMember({
      familyId: String(req.params.familyId),
      actorId: req.user!.userId,
      targetUserId: parseInt(String(req.params.userId), 10),
      reason,
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// 13. Transfer Family Ownership
// -----------------------------------------------------------------------------
familyRouter.post('/:familyId/transfer-owner', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { newOwnerUserId } = req.body;
    if (!newOwnerUserId) {
      res.status(400).json({ success: false, error: 'VALIDATION_ERROR', message: 'newOwnerUserId is required.' });
      return;
    }
    const result = await FamilyService.transferOwnership({
      familyId: String(req.params.familyId),
      currentOwnerId: req.user!.userId,
      newOwnerUserId: Number(newOwnerUserId),
    });
    res.status(200).json({ success: true, message: 'Ownership transferred successfully! 👑', data: result });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// 14. Create Family Audio Room
// -----------------------------------------------------------------------------
familyRouter.post('/:familyId/rooms', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, isFamilyOnly, seatCount } = req.body;
    if (!title) {
      res.status(400).json({ success: false, error: 'VALIDATION_ERROR', message: 'Room title is required.' });
      return;
    }
    const result = await FamilyService.createFamilyRoom({
      familyId: String(req.params.familyId),
      hostUserId: req.user!.userId,
      title,
      isFamilyOnly,
      seatCount: seatCount || 10,
    });
    res.status(201).json({ success: true, message: 'Family audio room created! 🎙️', data: result });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// 15. Post & Get Family Chat Messages
// -----------------------------------------------------------------------------
familyRouter.get('/:familyId/chat', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const messages = await FamilyService.getFamilyMessages(String(req.params.familyId), limit);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
});

familyRouter.post('/:familyId/chat', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { content, type, mediaUrl, replyToId } = req.body;
    if (!content || content.trim().length === 0) {
      res.status(400).json({ success: false, error: 'VALIDATION_ERROR', message: 'Message content cannot be empty.' });
      return;
    }
    const message = await FamilyService.postFamilyMessage({
      familyId: String(req.params.familyId),
      senderId: req.user!.userId,
      content,
      type,
      mediaUrl,
      replyToId,
    });
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// 16. Post Family Announcement
// -----------------------------------------------------------------------------
familyRouter.post('/:familyId/announcements', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, content, isPinned } = req.body;
    if (!title || !content) {
      res.status(400).json({ success: false, error: 'VALIDATION_ERROR', message: 'Title and content are required.' });
      return;
    }
    const announcement = await FamilyService.postAnnouncement({
      familyId: String(req.params.familyId),
      authorId: req.user!.userId,
      title,
      content,
      isPinned,
    });
    res.status(201).json({ success: true, message: 'Announcement posted! 📢', data: announcement });
  } catch (error) {
    next(error);
  }
});
