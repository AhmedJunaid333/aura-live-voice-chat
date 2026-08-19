import { prisma } from '../config/database.js';

export interface CreateApplicationDto {
  type: 'AGENCY' | 'HOSTING';
  fullName: string;
  phone: string;
  email?: string;
  country?: string;
  city: string;
  agencyName?: string;
  agencyDescription?: string;
  expectedHosts?: number;
  category?: string;
  dailyHours?: number;
  schedule?: string;
  experience?: string;
  whyJoin: string;
  socialLinks?: string;
  documentsJson?: string;
  additionalInfo?: string;
}

export class ApplicationService {
  /**
   * Submit a new Agency or Hosting Application
   */
  static async createApplication(userId: number, dto: CreateApplicationDto) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, numericId: true, username: true, country: true, role: true },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    // Duplicate protection: Check if user already has an active application
    const activeApp = await prisma.application.findFirst({
      where: {
        userId,
        type: dto.type,
        status: { in: ['PENDING', 'UNDER_REVIEW', 'APPROVED'] },
      },
    });

    if (activeApp) {
      if (activeApp.status === 'APPROVED') {
        throw new Error(`You already have an approved ${dto.type} application.`);
      }
      throw new Error(`You already have a ${dto.type} application currently ${activeApp.status.toLowerCase().replace('_', ' ')}.`);
    }

    // Generate unique human-readable application ID
    const prefix = dto.type === 'AGENCY' ? 'APP-AGY' : 'APP-HST';
    const randSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const applicationId = `${prefix}-${user.numericId}-${randSuffix}`;

    const created = await prisma.application.create({
      data: {
        applicationId,
        userId,
        type: dto.type,
        status: 'PENDING',
        fullName: dto.fullName.trim(),
        username: user.username,
        phone: dto.phone.trim(),
        email: dto.email?.trim() || null,
        country: dto.country?.trim() || user.country || 'Pakistan',
        city: dto.city.trim(),
        agencyName: dto.agencyName?.trim() || null,
        agencyDescription: dto.agencyDescription?.trim() || null,
        expectedHosts: dto.expectedHosts ? Number(dto.expectedHosts) : null,
        category: dto.category?.trim() || null,
        dailyHours: dto.dailyHours ? Number(dto.dailyHours) : null,
        schedule: dto.schedule?.trim() || null,
        experience: dto.experience?.trim() || null,
        whyJoin: dto.whyJoin.trim(),
        socialLinks: dto.socialLinks?.trim() || null,
        documentsJson: dto.documentsJson || '[]',
        additionalInfo: dto.additionalInfo?.trim() || null,
      },
    });

    // Create confirmation notification for applicant
    await prisma.notification.create({
      data: {
        recipientId: userId,
        senderId: userId,
        type: 'SYSTEM',
        entityId: created.id,
        title: `${dto.type === 'AGENCY' ? 'Agency' : 'Hosting'} Application Submitted 📋`,
        message: `Your application (${applicationId}) has been received and is pending admin review.`,
      },
    }).catch(err => console.warn('Notification creation error:', err));

    return created;
  }

  /**
   * Get all applications for the authenticated user
   */
  static async getMyApplications(userId: number) {
    const applications = await prisma.application.findMany({
      where: { userId },
      orderBy: { submittedAt: 'desc' },
    });

    const activeAgencyApp = applications.find(a => a.type === 'AGENCY' && ['PENDING', 'UNDER_REVIEW', 'APPROVED'].includes(a.status));
    const activeHostingApp = applications.find(a => a.type === 'HOSTING' && ['PENDING', 'UNDER_REVIEW', 'APPROVED'].includes(a.status));

    return {
      applications,
      canApplyAgency: !activeAgencyApp,
      canApplyHosting: !activeHostingApp,
      activeAgencyApp: activeAgencyApp || null,
      activeHostingApp: activeHostingApp || null,
    };
  }

  /**
   * Get single application by ID with security check
   */
  static async getApplicationById(id: string, userId: number, isAdmin: boolean) {
    const app = await prisma.application.findFirst({
      where: {
        OR: [
          { id },
          { applicationId: id },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            numericId: true,
            username: true,
            avatar: true,
            role: true,
            status: true,
            country: true,
          },
        },
      },
    });

    if (!app) {
      throw new Error('Application not found.');
    }

    if (!isAdmin && app.userId !== userId) {
      throw new Error('Unauthorized access to application.');
    }

    return app;
  }

  /**
   * Admin: List all applications with filtering, search & stats
   */
  static async getAdminApplications(params: {
    type?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.type && params.type !== 'ALL') {
      where.type = params.type.toUpperCase();
    }

    if (params.status && params.status !== 'ALL') {
      where.status = params.status.toUpperCase();
    }

    if (params.search && params.search.trim().length > 0) {
      const q = params.search.trim();
      where.OR = [
        { applicationId: { contains: q, mode: 'insensitive' } },
        { fullName: { contains: q, mode: 'insensitive' } },
        { username: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { agencyName: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [applications, total, agencyCount, hostingCount, pendingCount, underReviewCount, approvedCount, rejectedCount] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              numericId: true,
              username: true,
              avatar: true,
              role: true,
              status: true,
              country: true,
            },
          },
        },
        orderBy: { submittedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.application.count({ where }),
      prisma.application.count({ where: { type: 'AGENCY' } }),
      prisma.application.count({ where: { type: 'HOSTING' } }),
      prisma.application.count({ where: { status: 'PENDING' } }),
      prisma.application.count({ where: { status: 'UNDER_REVIEW' } }),
      prisma.application.count({ where: { status: 'APPROVED' } }),
      prisma.application.count({ where: { status: 'REJECTED' } }),
    ]);

    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalAll: agencyCount + hostingCount,
        agencyCount,
        hostingCount,
        pendingCount,
        underReviewCount,
        approvedCount,
        rejectedCount,
      },
    };
  }

  /**
   * Admin: Review / Approve / Reject / Put Under Review
   */
  static async updateApplicationStatus(
    id: string,
    adminId: number,
    status: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW' | 'CANCELLED',
    adminNotes?: string,
    rejectionReason?: string,
  ) {
    const existing = await prisma.application.findFirst({
      where: {
        OR: [{ id }, { applicationId: id }],
      },
      include: { user: true },
    });

    if (!existing) {
      throw new Error('Application not found.');
    }

    if (status === 'REJECTED' && (!rejectionReason || rejectionReason.trim().length === 0)) {
      throw new Error('Rejection reason is mandatory when rejecting an application.');
    }

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update Application status
      const app = await tx.application.update({
        where: { id: existing.id },
        data: {
          status,
          adminNotes: adminNotes?.trim() || existing.adminNotes,
          rejectionReason: status === 'REJECTED' ? rejectionReason?.trim() : existing.rejectionReason,
          reviewedBy: adminId,
          reviewedAt: new Date(),
        },
        include: { user: true },
      });

      // 2. If APPROVED, promote User Role & Permissions
      if (status === 'APPROVED') {
        if (existing.type === 'AGENCY') {
          // Promote to AGENCY_OWNER unless user is higher privileged (ADMIN / SUPER_ADMIN)
          if (!['ADMIN', 'SUPER_ADMIN', 'SUPER_ADMIN_CEO'].includes(existing.user.role)) {
            await tx.user.update({
              where: { id: existing.userId },
              data: { role: 'AGENCY_OWNER' },
            });
          }
        } else if (existing.type === 'HOSTING') {
          // Promote to HOST unless user is higher privileged (ADMIN / SUPER_ADMIN / AGENCY_OWNER)
          if (!['ADMIN', 'SUPER_ADMIN', 'SUPER_ADMIN_CEO', 'AGENCY_OWNER'].includes(existing.user.role)) {
            await tx.user.update({
              where: { id: existing.userId },
              data: { role: 'HOST' },
            });
          }
        }
      }

      // 3. Send real-time notification to user
      let title = '';
      let message = '';

      if (status === 'APPROVED') {
        title = `🎉 ${existing.type === 'AGENCY' ? 'Agency' : 'Hosting'} Application Approved!`;
        message = existing.type === 'AGENCY'
          ? 'Congratulations! Your Agency application has been approved. You can now manage hosts and access Agency features.'
          : 'Congratulations! Your Hosting application has been approved. You are now eligible to start broadcasting live!';
      } else if (status === 'REJECTED') {
        title = `❌ ${existing.type === 'AGENCY' ? 'Agency' : 'Hosting'} Application Update`;
        message = `Your application was not approved. Reason: ${rejectionReason}`;
      } else if (status === 'UNDER_REVIEW') {
        title = `🔍 ${existing.type === 'AGENCY' ? 'Agency' : 'Hosting'} Application Under Review`;
        message = 'Our administrative team is actively reviewing your application.';
      }

      if (title && message) {
        await tx.notification.create({
          data: {
            recipientId: existing.userId,
            senderId: adminId,
            type: 'SYSTEM',
            entityId: existing.id,
            title,
            message,
          },
        }).catch(err => console.warn('Notification send warning:', err));
      }

      return app;
    });

    return updated;
  }
}
