export interface ActivityLogEntry {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  ipAddress?: string;
  timestamp: Date;
}

export class AdminAuditService {
  private activityLogs: ActivityLogEntry[] = [];

  async logAction(params: {
    adminId: string;
    action: string;
    targetType: string;
    targetId: string;
    oldValue?: Record<string, any>;
    newValue?: Record<string, any>;
    ipAddress?: string;
  }): Promise<ActivityLogEntry> {
    const entry: ActivityLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      adminId: params.adminId,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      oldValue: params.oldValue,
      newValue: params.newValue,
      ipAddress: params.ipAddress || '127.0.0.1',
      timestamp: new Date()
    };
    this.activityLogs.push(entry);
    return entry;
  }

  getLogs(adminId?: string): ActivityLogEntry[] {
    if (adminId) return this.activityLogs.filter(log => log.adminId === adminId);
    return this.activityLogs;
  }
}
