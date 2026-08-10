import { Router } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { ChatService } from '../services/chat.service.js';
import { z } from 'zod';

export const chatRouter = Router();

const sendMessageSchema = z.object({
  conversationId: z.string().optional(),
  targetNumericId: z.number().int().positive().optional(),
  content: z.string().min(1),
  type: z.enum(['TEXT', 'EMOJI', 'IMAGE', 'GIF', 'VOICE', 'GIFT', 'OFFICIAL_INVITATION']).default('TEXT'),
  mediaUrl: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

const reportMessageSchema = z.object({
  reportedUserId: z.number().int().positive(),
  messageId: z.string().optional(),
  reason: z.string().min(3),
});

// 1. Get User Conversations
chatRouter.get('/conversations', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const conversations = await ChatService.getConversations(userId);
    res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    next(error);
  }
});

// 2. Get or Create Direct 1-to-1 Conversation
chatRouter.post('/conversations/direct', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { targetNumericId } = req.body;
    if (!targetNumericId || typeof targetNumericId !== 'number') {
      res.status(400).json({ success: false, error: 'targetNumericId is required.' });
      return;
    }
    const conversation = await ChatService.getOrCreateDirectConversation(req.user!.userId, targetNumericId);
    res.status(200).json({ success: true, data: conversation });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 3. Get Conversation Messages
chatRouter.get('/conversations/:conversationId/messages', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const conversationId = req.params.conversationId as string;
    const messages = await ChatService.getMessages(conversationId, req.user!.userId);
    res.status(200).json({ success: true, data: messages });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 4. Send Real Message
chatRouter.post('/send', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = sendMessageSchema.parse(req.body);
    const message = await ChatService.sendMessage(req.user!.userId, validated);
    res.status(201).json({ success: true, data: message });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 5. Mark Conversation as Read
chatRouter.patch('/conversations/:id/read', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const conversationId = req.params.id as string;
    const result = await ChatService.markRead(req.user!.userId, conversationId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 6. Delete Message
chatRouter.delete('/messages/:id', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const messageId = req.params.id as string;
    const result = await ChatService.deleteMessage(req.user!.userId, messageId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 7. Report Message / User
chatRouter.post('/messages/report', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = reportMessageSchema.parse(req.body);
    const report = await ChatService.reportMessage(req.user!.userId, validated);
    res.status(201).json({ success: true, data: report });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 8. Get Total Unread Count
chatRouter.get('/unread-count', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const count = await ChatService.getUnreadCount(req.user!.userId);
    res.status(200).json({ success: true, data: { unreadCount: count } });
  } catch (error) {
    next(error);
  }
});

// 9. Admin Moderation Reports Endpoint
chatRouter.get('/reports', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const reports = await ChatService.getAdminReports();
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
});

// 10. Admin Resolve / Dismiss Report
chatRouter.patch('/reports/:id/resolve', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const reportId = req.params.id as string;
    const { status, resolutionNote } = req.body;
    const result = await ChatService.resolveReport(reportId, status || 'RESOLVED', resolutionNote);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});
