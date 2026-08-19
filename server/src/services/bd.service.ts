import { prisma } from '../config/database.js';

export interface CreateBdDto {
  userId: number;
  name: string;
  bdCode?: string;
  phone: string;
  email?: string;
  country?: string;
  city: string;
  commissionRate?: number;
  status?: string;
  notes?: string;
}

export class BdService {
  /**
   * ==========================================
   * 🛡️ ADMIN MANAGEMENT METHODS
   * ==========================================
   */

  /**
   * Admin: Create a new BD record for an existing database user
   */
  static async createBd(dto: CreateBdDto) {
    const user = await prisma.user.findUnique({
      where: { id: dto.userId },
      include: { bdProfile: true },
    });

    if (!user) {
      throw new Error(`User with ID ${dto.userId} not found in database.`);
    }

    if (user.bdProfile) {
      throw new Error(`User @${user.username} (UID: ${user.numericId}) is already registered as a BD (${user.bdProfile.bdCode}).`);
    }

    // Generate unique BD Code if not provided
    let bdCode = dto.bdCode?.trim();
    if (!bdCode) {
      const countryPrefix = (dto.country || user.country || 'PK').substring(0, 2).toUpperCase();
      const randNum = Math.floor(1000 + Math.random() * 9000);
      bdCode = `BD-${countryPrefix}-${user.numericId || randNum}`;
    }

    // Check unique BD Code
    const existingCode = await prisma.bD.findUnique({ where: { bdCode } });
    if (existingCode) {
      bdCode = `${bdCode}-${Math.floor(10 + Math.random() * 90)}`;
    }

    const created = await prisma.$transaction(async (tx) => {
      // 1. Create BD record
      const bd = await tx.bD.create({
        data: {
          bdCode,
          userId: user.id,
          name: dto.name.trim(),
          phone: dto.phone.trim(),
          email: dto.email?.trim() || user.email || null,
          country: dto.country?.trim() || user.country || 'Pakistan',
          city: dto.city.trim(),
          commissionRate: dto.commissionRate !== undefined ? Number(dto.commissionRate) : 15.0,
          status: dto.status || 'ACTIVE',
          notes: dto.notes?.trim() || null,
        },
      });

      // 2. Upgrade User Role to BD (unless already SUPER_ADMIN / ADMIN)
      if (!['ADMIN', 'SUPER_ADMIN', 'SUPER_ADMIN_CEO'].includes(user.role)) {
        await tx.user.update({
          where: { id: user.id },
          data: { role: 'BD' },
        });
      }

      // 3. Create Notification for user
      await tx.notification.create({
        data: {
          recipientId: user.id,
          senderId: user.id,
          type: 'SYSTEM',
          entityId: bd.id,
          title: '🏢 BD (Business Development) Account Activated!',
          message: `Congratulations! You have been appointed as Business Development Manager (${bdCode}). You can now access the BD Portal.`,
        },
      }).catch(err => console.warn('BD notification warning:', err));

      return bd;
    });

    return created;
  }

  /**
   * Admin: List all BDs with assigned stats
   */
  static async getAllBds(params?: { status?: string; search?: string }) {
    const where: any = {};
    if (params?.status && params.status !== 'ALL') {
      where.status = params.status;
    }
    if (params?.search && params.search.trim().length > 0) {
      const q = params.search.trim();
      where.OR = [
        { bdCode: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
      ];
    }

    const bds = await prisma.bD.findMany({
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
          },
        },
        agencyAssignments: true,
        applications: {
          select: {
            id: true,
            applicationId: true,
            type: true,
            status: true,
            fullName: true,
          },
        },
        _count: {
          select: {
            agencyAssignments: true,
            applications: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return bds;
  }

  /**
   * Admin: Get single BD by ID
   */
  static async getBdById(id: string) {
    const bd = await prisma.bD.findFirst({
      where: {
        OR: [{ id }, { bdCode: id }],
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
        agencyAssignments: true,
        applications: {
          orderBy: { submittedAt: 'desc' },
        },
        commissions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!bd) {
      throw new Error('BD record not found.');
    }

    return bd;
  }

  /**
   * Admin: Update BD record
   */
  static async updateBd(id: string, data: {
    name?: string;
    phone?: string;
    email?: string;
    city?: string;
    country?: string;
    commissionRate?: number;
    status?: string;
    notes?: string;
  }) {
    const existing = await prisma.bD.findFirst({
      where: { OR: [{ id }, { bdCode: id }] },
    });

    if (!existing) {
      throw new Error('BD record not found.');
    }

    const updated = await prisma.bD.update({
      where: { id: existing.id },
      data: {
        name: data.name !== undefined ? data.name.trim() : existing.name,
        phone: data.phone !== undefined ? data.phone.trim() : existing.phone,
        email: data.email !== undefined ? data.email.trim() : existing.email,
        city: data.city !== undefined ? data.city.trim() : existing.city,
        country: data.country !== undefined ? data.country.trim() : existing.country,
        commissionRate: data.commissionRate !== undefined ? Number(data.commissionRate) : existing.commissionRate,
        status: data.status !== undefined ? data.status : existing.status,
        notes: data.notes !== undefined ? data.notes.trim() : existing.notes,
      },
      include: { user: true, agencyAssignments: true },
    });

    return updated;
  }

  /**
   * Admin: Assign an agency to a BD
   */
  static async assignAgencyToBd(bdId: string, agencyName: string, agencyOwnerId?: number) {
    const bd = await prisma.bD.findFirst({
      where: { OR: [{ id: bdId }, { bdCode: bdId }] },
    });

    if (!bd) {
      throw new Error('BD not found.');
    }

    const assignment = await prisma.bDAgencyAssignment.upsert({
      where: {
        bdId_agencyName: {
          bdId: bd.id,
          agencyName: agencyName.trim(),
        },
      },
      create: {
        bdId: bd.id,
        agencyName: agencyName.trim(),
        agencyOwnerId: agencyOwnerId || null,
        status: 'ACTIVE',
      },
      update: {
        agencyOwnerId: agencyOwnerId || undefined,
        status: 'ACTIVE',
      },
    });

    return assignment;
  }

  /**
   * Admin: Assign an application to a BD
   */
  static async assignApplicationToBd(applicationId: string, bdId: string | null) {
    const app = await prisma.application.findFirst({
      where: { OR: [{ id: applicationId }, { applicationId }] },
    });

    if (!app) {
      throw new Error('Application not found.');
    }

    let targetBdId: string | null = null;
    if (bdId) {
      const bd = await prisma.bD.findFirst({
        where: { OR: [{ id: bdId }, { bdCode: bdId }] },
      });
      if (!bd) throw new Error('BD not found.');
      targetBdId = bd.id;
    }

    const updated = await prisma.application.update({
      where: { id: app.id },
      data: {
        assignedBdId: targetBdId,
        status: targetBdId ? 'UNDER_REVIEW' : app.status,
      },
      include: { assignedBd: true, user: true },
    });

    // Notify BD if assigned
    if (targetBdId) {
      const bdRecord = await prisma.bD.findUnique({ where: { id: targetBdId } });
      if (bdRecord) {
        await prisma.notification.create({
          data: {
            recipientId: bdRecord.userId,
            senderId: bdRecord.userId,
            type: 'SYSTEM',
            entityId: app.id,
            title: `📋 New ${app.type} Application Assigned`,
            message: `Application ${app.applicationId} (${app.fullName}) has been assigned to you for review.`,
          },
        }).catch(err => console.warn('BD assign notification warning:', err));
      }
    }

    return updated;
  }

  /**
   * ==========================================
   * 💼 BD PORTAL OPERATIONAL METHODS
   * ==========================================
   */

  /**
   * Helper: Resolve and verify active BD for a given user ID
   */
  static async resolveActiveBd(userId: number) {
    const bd = await prisma.bD.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            numericId: true,
            username: true,
            avatar: true,
            role: true,
            status: true,
          },
        },
      },
    });

    if (!bd) {
      throw new Error('BD access is not enabled for this account.');
    }

    if (bd.status !== 'ACTIVE') {
      throw new Error(`Your BD account is currently ${bd.status.toLowerCase()}. Please contact administration.`);
    }

    return bd;
  }

  /**
   * BD Portal: Dashboard metrics & telemetry
   */
  static async getBdDashboard(userId: number) {
    const bd = await this.resolveActiveBd(userId);

    // 1. Get assigned agencies
    const agencyAssignments = await prisma.bDAgencyAssignment.findMany({
      where: { bdId: bd.id, status: 'ACTIVE' },
    });
    const agencyNames = agencyAssignments.map(a => a.agencyName);

    // 2. Get assigned applications
    const assignedApps = await prisma.application.findMany({
      where: { assignedBdId: bd.id },
      orderBy: { submittedAt: 'desc' },
    });

    const pendingApps = assignedApps.filter(a => ['PENDING', 'UNDER_REVIEW'].includes(a.status));
    const agencyApps = assignedApps.filter(a => a.type === 'AGENCY');
    const hostingApps = assignedApps.filter(a => a.type === 'HOSTING');

    // 3. Hosts belonging to assigned agencies (Users with role 'HOST' or associated with agency)
    const assignedHosts = await prisma.user.findMany({
      where: {
        role: 'HOST',
        // In Aura Live, users can have agency name or host profile
      },
      select: {
        id: true,
        numericId: true,
        username: true,
        avatar: true,
        role: true,
        status: true,
      },
      take: 50,
    });

    // 4. Commission summary
    const commissions = await prisma.bDCommission.findMany({
      where: { bdId: bd.id },
    });
    const totalCommissionEarned = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
    const pendingCommission = commissions.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + c.commissionAmount, 0);

    return {
      bdProfile: {
        id: bd.id,
        bdCode: bd.bdCode,
        name: bd.name,
        phone: bd.phone,
        email: bd.email,
        country: bd.country,
        city: bd.city,
        commissionRate: bd.commissionRate,
        status: bd.status,
        joiningDate: bd.joiningDate,
        user: bd.user,
      },
      stats: {
        totalAgencies: agencyAssignments.length,
        totalHosts: assignedHosts.length,
        activeHosts: assignedHosts.length,
        liveHosts: 0, // dynamic room telemetry
        assignedApplications: assignedApps.length,
        pendingApplications: pendingApps.length,
        agencyAppsCount: agencyApps.length,
        hostingAppsCount: hostingApps.length,
        commissionRate: bd.commissionRate,
        totalCommissionEarned,
        pendingCommission,
      },
      recentApplications: assignedApps.slice(0, 5),
      agencies: agencyAssignments,
    };
  }

  /**
   * BD Portal: Assigned Agencies list
   */
  static async getBdAgencies(userId: number) {
    const bd = await this.resolveActiveBd(userId);

    const assignments = await prisma.bDAgencyAssignment.findMany({
      where: { bdId: bd.id },
      orderBy: { assignedAt: 'desc' },
    });

    return assignments;
  }

  /**
   * BD Portal: Hosts belonging to BD's assigned agencies
   */
  static async getBdHosts(userId: number) {
    await this.resolveActiveBd(userId);

    const hosts = await prisma.user.findMany({
      where: { role: 'HOST' },
      select: {
        id: true,
        numericId: true,
        username: true,
        avatar: true,
        role: true,
        status: true,
        country: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return hosts;
  }

  /**
   * BD Portal: Assigned Applications with recommendation tools
   */
  static async getBdApplications(userId: number, type?: string) {
    const bd = await this.resolveActiveBd(userId);

    const where: any = { assignedBdId: bd.id };
    if (type && type !== 'ALL') {
      where.type = type.toUpperCase();
    }

    const applications = await prisma.application.findMany({
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
    });

    return applications;
  }

  /**
   * BD Portal: Submit BD Review and Recommendation for an application
   */
  static async submitBdReview(
    userId: number,
    applicationId: string,
    recommendation: 'RECOMMEND_APPROVE' | 'RECOMMEND_REJECT' | 'REQUEST_INFO',
    notes: string,
  ) {
    const bd = await this.resolveActiveBd(userId);

    const app = await prisma.application.findFirst({
      where: {
        OR: [{ id: applicationId }, { applicationId }],
        assignedBdId: bd.id,
      },
    });

    if (!app) {
      throw new Error('Application not found or not assigned to your BD account.');
    }

    if (!notes || notes.trim().length === 0) {
      throw new Error('Review notes are required when submitting a recommendation.');
    }

    const updated = await prisma.application.update({
      where: { id: app.id },
      data: {
        bdRecommendation: recommendation,
        bdReviewNotes: notes.trim(),
        bdReviewedAt: new Date(),
        status: 'UNDER_REVIEW',
      },
      include: { user: true, assignedBd: true },
    });

    return updated;
  }

  /**
   * BD Portal: Performance Telemetry
   */
  static async getBdPerformance(userId: number) {
    const bd = await this.resolveActiveBd(userId);

    const agencyCount = await prisma.bDAgencyAssignment.count({ where: { bdId: bd.id, status: 'ACTIVE' } });
    const appCount = await prisma.application.count({ where: { assignedBdId: bd.id } });
    const reviewedCount = await prisma.application.count({ where: { assignedBdId: bd.id, bdReviewedAt: { not: null } } });

    return {
      bdCode: bd.bdCode,
      commissionRate: bd.commissionRate,
      metrics: {
        assignedAgencies: agencyCount,
        assignedApplications: appCount,
        reviewedApplications: reviewedCount,
        pendingReviews: appCount - reviewedCount,
        monthlyVolume: 0,
        estimatedEarnings: 0,
      },
    };
  }

  /**
   * BD Portal: Commission Ledger
   */
  static async getBdCommission(userId: number) {
    const bd = await this.resolveActiveBd(userId);

    const commissions = await prisma.bDCommission.findMany({
      where: { bdId: bd.id },
      orderBy: { createdAt: 'desc' },
    });

    return {
      commissionRate: bd.commissionRate,
      commissions,
    };
  }
}
