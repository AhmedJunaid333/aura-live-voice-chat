import { prisma } from '../config/database.js';
import { emitToUser, broadcastGlobal } from '../websocket/socketServer.js';

export class ResellerService {
  /**
   * Admin: Send Official Reseller Invitation
   */
  static async sendInvitation(data: {
    targetNumericId: number;
    adminUserId: number;
    type?: string;
    message?: string;
    requirements?: string[];
    benefits?: string[];
    expiryDays?: number;
  }) {
    const targetUser = await prisma.user.findUnique({
      where: { numericId: data.targetNumericId },
    });

    if (!targetUser) {
      throw new Error(`Target user with ID ${data.targetNumericId} not found in database.`);
    }

    const invitationCode = `INV-${targetUser.numericId}-${Math.floor(1000 + Math.random() * 9000)}`;
    const expiryDays = data.expiryDays || 7;
    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

    const invitation = await prisma.resellerInvitation.create({
      data: {
        code: invitationCode,
        type: data.type || 'RESELLER',
        targetUserId: targetUser.id,
        invitedByAdminId: data.adminUserId,
        message: data.message || 'Official Invitation to join Aura Live Diamond Reseller Network.',
        requirements: JSON.stringify(data.requirements || ['Minimum coin distribution volume', 'Active KYC identity verification']),
        benefits: JSON.stringify(data.benefits || ['18% wholesale margin', 'Dedicated Diamond Portal', 'Atomic transfer tools']),
        expiryDays,
        expiresAt,
        status: 'PENDING',
      },
    });

    // Realtime Notification via Socket.IO directly to target user's chat
    emitToUser(targetUser.numericId, 'reseller.invitation', {
      invitationCode: invitation.code,
      type: invitation.type,
      message: invitation.message,
      expiresAt: invitation.expiresAt.toISOString(),
      timestamp: new Date().toISOString(),
    });

    return invitation;
  }

  /**
   * User: Submit Reseller Application Form
   */
  static async submitApplication(data: {
    userId: number;
    invitationCode: string;
    applicantName: string;
    phone?: string;
    email?: string;
    country?: string;
    city?: string;
    businessNotes?: string;
  }) {
    const invitation = await prisma.resellerInvitation.findUnique({
      where: { code: data.invitationCode },
    });

    if (!invitation) {
      throw new Error('Invalid invitation code. Please check your official chat.');
    }

    if (invitation.status !== 'PENDING') {
      throw new Error(`Invitation is already ${invitation.status.toLowerCase()}.`);
    }

    const application = await prisma.resellerApplication.create({
      data: {
        invitationId: invitation.id,
        userId: data.userId,
        type: invitation.type,
        applicantName: data.applicantName,
        phone: data.phone,
        email: data.email,
        country: data.country,
        city: data.city,
        formData: JSON.stringify({ businessNotes: data.businessNotes }),
        status: 'SUBMITTED',
      },
    });

    // Update invitation status to ACCEPTED
    await prisma.resellerInvitation.update({
      where: { id: invitation.id },
      data: { status: 'ACCEPTED' },
    });

    // Notify Admins in Realtime
    broadcastGlobal('reseller.application_submitted', {
      applicationId: application.id,
      applicantName: application.applicantName,
      type: application.type,
      timestamp: new Date().toISOString(),
    });

    return application;
  }

  /**
   * Admin: Approve Application & Activate Reseller Role
   */
  static async approveAndActivateReseller(applicationId: string, adminUserId: number) {
    const application = await prisma.resellerApplication.findUnique({
      where: { id: applicationId },
      include: { user: true },
    });

    if (!application) {
      throw new Error('Application not found.');
    }

    // Atomic Transaction: Update Application, Update User Role, Create Reseller Account
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Application status
      const updatedApp = await tx.resellerApplication.update({
        where: { id: applicationId },
        data: {
          status: 'APPROVED',
          reviewerAdminId: adminUserId,
        },
      });

      // 2. Update User role
      const updatedUser = await tx.user.update({
        where: { id: application.userId },
        data: { role: 'DIAMOND_RESELLER' },
      });

      // 3. Create or Update Reseller Account
      const resellerAccount = await tx.resellerAccount.upsert({
        where: { userId: application.userId },
        create: {
          userId: application.userId,
          role: 'DIAMOND_RESELLER',
          status: 'ACTIVE',
          diamondBalance: 0,
        },
        update: {
          role: 'DIAMOND_RESELLER',
          status: 'ACTIVE',
        },
      });

      return { updatedApp, updatedUser, resellerAccount };
    });

    // Emit Realtime Event to User to activate Reseller Portal Tab
    emitToUser(application.user.numericId, 'reseller.activated', {
      role: 'DIAMOND_RESELLER',
      status: 'ACTIVE',
      timestamp: new Date().toISOString(),
    });

    return result;
  }

  /**
   * Admin: Allocate Company Diamonds to Reseller (COMPANY_TO_RESELLER)
   */
  static async allocateCompanyDiamonds(data: {
    resellerNumericId: number;
    amount: number;
    notes?: string;
  }) {
    const resellerUser = await prisma.user.findUnique({
      where: { numericId: data.resellerNumericId },
      include: { resellerAccount: true },
    });

    if (!resellerUser || !resellerUser.resellerAccount) {
      throw new Error(`Active reseller with ID ${data.resellerNumericId} not found.`);
    }

    const amountInt = data.amount;

    // Atomic Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Credit Reseller Account
      const updatedAccount = await tx.resellerAccount.update({
        where: { id: resellerUser.resellerAccount!.id },
        data: {
          diamondBalance: { increment: amountInt },
          diamondsReceived: { increment: amountInt },
        },
      });

      // 2. Also sync User diamond balance
      await tx.user.update({
        where: { id: resellerUser.id },
        data: { diamonds: { increment: amountInt } },
      });

      // 3. Log Reseller Ledger Record
      const ledgerEntry = await tx.resellerLedger.create({
        data: {
          senderId: 'SYSTEM_COMPANY',
          senderRole: 'COMPANY',
          receiverId: resellerUser.resellerAccount!.id,
          receiverRole: 'DIAMOND_RESELLER',
          amount: amountInt,
          type: 'COMPANY_TO_RESELLER',
          referenceId: `ALLOC_${Date.now()}`,
        },
      });

      return { updatedAccount, ledgerEntry };
    });

    // Realtime update to Reseller
    emitToUser(resellerUser.numericId, 'diamond.updated', {
      balance: result.updatedAccount.diamondBalance,
      amount: data.amount,
      type: 'COMPANY_TO_RESELLER',
      timestamp: new Date().toISOString(),
    });

    return {
      resellerNumericId: resellerUser.numericId,
      newDiamondBalance: result.updatedAccount.diamondBalance,
      allocatedAmount: data.amount,
    };
  }

  /**
   * Reseller: Transfer Diamonds to Target User (RESELLER_TO_USER)
   */
  static async transferDiamondsToUser(data: {
    resellerUserId: number;
    targetNumericId: number;
    amount: number;
    notes?: string;
  }) {
    const resellerAccount = await prisma.resellerAccount.findUnique({
      where: { userId: data.resellerUserId },
      include: { user: true },
    });

    if (!resellerAccount || resellerAccount.status !== 'ACTIVE') {
      throw new Error('Unauthorized. You must have an active Diamond Reseller account.');
    }

    const amountInt = data.amount;
    if (resellerAccount.diamondBalance < amountInt) {
      throw new Error(`Insufficient diamond balance. Available: ${resellerAccount.diamondBalance}, Required: ${data.amount}`);
    }

    const targetUser = await prisma.user.findUnique({
      where: { numericId: data.targetNumericId },
    });

    if (!targetUser) {
      throw new Error(`Target user with ID ${data.targetNumericId} does not exist.`);
    }

    // Atomic Transaction: Debit Reseller, Credit User, Record Ledger
    const result = await prisma.$transaction(async (tx) => {
      // 1. Debit Reseller
      const updatedReseller = await tx.resellerAccount.update({
        where: { id: resellerAccount.id },
        data: {
          diamondBalance: { decrement: amountInt },
          diamondsSent: { increment: amountInt },
        },
      });

      // 2. Credit Target User
      const updatedTargetUser = await tx.user.update({
        where: { id: targetUser.id },
        data: { diamonds: { increment: amountInt } },
      });

      // 3. Log Reseller Ledger
      const ledgerEntry = await tx.resellerLedger.create({
        data: {
          senderId: resellerAccount.id,
          senderRole: 'DIAMOND_RESELLER',
          receiverId: targetUser.id.toString(),
          receiverRole: 'USER',
          amount: amountInt,
          type: 'RESELLER_TO_USER',
          referenceId: `XFER_${Date.now()}`,
        },
      });

      return { updatedReseller, updatedTargetUser, ledgerEntry };
    });

    // Realtime Notifications to both parties
    emitToUser(resellerAccount.user.numericId, 'diamond.updated', {
      balance: result.updatedReseller.diamondBalance,
      debited: data.amount,
      targetUserId: targetUser.numericId,
    });

    emitToUser(targetUser.numericId, 'diamond.received', {
      balance: result.updatedTargetUser.diamonds,
      credited: data.amount,
      senderResellerId: resellerAccount.user.numericId,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      resellerRemainingBalance: result.updatedReseller.diamondBalance,
      targetUserNumericId: targetUser.numericId,
      transferredAmount: data.amount,
    };
  }
}
