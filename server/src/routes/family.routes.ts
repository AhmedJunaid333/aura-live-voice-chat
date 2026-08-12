import { Router } from 'express';
import { FamilyService } from '../services/family.service.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { prisma } from '../config/database.js';

export const familyRouter = Router();

// -----------------------------------------------------------------------------
// 1. Discover & List Families
// -----------------------------------------------------------------------------
familyRouter.get('/', async (req, res, next) => {
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
familyRouter.get('/rankings', async (req, res, next) => {
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
familyRouter.get('/my-family', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const membership = await FamilyService.getMyFamily(req.user!.id);
    res.status(200).json({ success: true, data: membership });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// 4. Get My Pending Family Invitations
// -----------------------------------------------------------------------------
familyRouter.get('/invitations/me', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const invitations = await FamilyService.getMyInvitations(req.user!.id);
    res.status(200).json({ success: true, data: invitations });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// 5. Respond to Invitation (Accept / Reject)
// -----------------------------------------------------------------------------
familyRouter.post('/invitations/:invitationId/respond', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { action } = req.body;
    if (!action || !['ACCEPTED', 'REJECTED'].includes(action)) {
      res.status(400).json({ success: false, error: 'VALIDATION_ERROR', message: 'Action must be ACCEPTED or REJECTED.' });
      return;
    }
    const result = await FamilyService.respondInvitation({
      invitationId: req.params.invitationId,
      userId: req.user!.id,
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
familyRouter.post('/', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { name, description, rules, logo, icon, country } = req.body;
    if (!name || name.trim().length < 3) {
      res.status(400).json({ success: false, error: 'VALIDATION_ERROR', message: 'Family name must be at least 3 characters long.' });
      return;
    }
    const result = await FamilyService.createFamily({
      ownerId: req.user!.id,
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
familyRouter.get('/:familyId', async (req, res, next) => {
  try {
    let currentUserId: number | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // optional token decoding
    }
    const family = await FamilyService.getFamilyProfile(req.params.familyId, currentUserId);
    res.status(200).json({ success: true, data: family });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// 8. Invite a User to Family
// -----------------------------------------------------------------------------
familyRouter.post('/:familyId/invite', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { targetUserId } = req.body;
    if (!targetUserId) {
      res.status(400).json({ success: false, error: 'VALIDATION_ERROR', message: 'targetUserId is required.' });
      return;
    }
    const invitation = await FamilyService.inviteMember({
      familyId: req.params.familyId,
      inviterId: req.user!.id,
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
familyRouter.post('/:familyId/leave', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await FamilyService.leaveFamily({
      familyId: req.params.familyId,
      userId: req.user!.id,
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------------------------------
// 10. Update Member Role (Promote / Demote)
// -----------------------------------------------------------------------------
familyRouter.post('/:familyId/members/:userId/role', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { newRole } = req.body;
    if (!newRole || !['ADMIN', 'CO_ADMIN', 'HOST', 'MEMBER'].includes(newRole)) {
      res.status(400).json({ success: false, error: 'VALIDATION_ERROR', message: 'Invalid role. Must be ADMIN, CO_ADMIN, HOST, or MEMBER.' });
      return;
    }
    const updated = await FamilyService.updateMemberRole({
      familyId: req.params.familyId,
      actorId: req.user!.id,
      targetUserId: parseInt(req.params.userId),
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
familyRouter.post('/:familyId/members/:userId/remove', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { reason } = req.body;
    const result = await FamilyService.removeMember({
      familyId: req.params.familyId,
      actorId: req.user!.id,
      targetUserId: parseInt(req.params.userId),
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
familyRouter.post('/:familyId/members/:userId/ban', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { reason } = req.body;
    const result = await FamilyService.banMember({
      familyId: req.params.familyId,
      actorId: req.user!.id,
      targetUserId: parseInt(req.params.userId),
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
familyRouter.post('/:familyId/transfer-owner', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { newOwnerUserId } = req.body;
    if (!newOwnerUserId) {
      res.status(400).json({ success: false, error: 'VALIDATION_ERROR', message: 'newOwnerUserId is required.' });
      return;
    }
    const result = await FamilyService.transferOwnership({
      familyId: req.params.familyId,
      currentOwnerId: req.user!.id,
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
familyRouter.post('/:familyId/rooms', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { title, isFamilyOnly, seatCount } = req.body;
    if (!title) {
      res.status(400).json({ success: false, error: 'VALIDATION_ERROR', message: 'Room title is required.' });
      return;
    }
    const result = await FamilyService.createFamilyRoom({
      familyId: req.params.familyId,
      hostUserId: req.user!.id,
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
familyRouter.get('/:familyId/chat', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const messages = await FamilyService.getFamilyMessages(req.params.familyId, limit);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
});

familyRouter.post('/:familyId/chat', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { content, type, mediaUrl, replyToId } = req.body;
    if (!content || content.trim().length === 0) {
      res.status(400).json({ success: false, error: 'VALIDATION_ERROR', message: 'Message content cannot be empty.' });
      return;
    }
    const message = await FamilyService.postFamilyMessage({
      familyId: req.params.familyId,
      senderId: req.user!.id,
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
familyRouter.post('/:familyId/announcements', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { title, content, isPinned } = req.body;
    if (!title || !content) {
      res.status(400).json({ success: false, error: 'VALIDATION_ERROR', message: 'Title and content are required.' });
      return;
    }
    const announcement = await FamilyService.postAnnouncement({
      familyId: req.params.familyId,
      authorId: req.user!.id,
      title,
      content,
      isPinned,
    });
    res.status(201).json({ success: true, message: 'Announcement posted! 📢', data: announcement });
  } catch (error) {
    next(error);
  }
});
