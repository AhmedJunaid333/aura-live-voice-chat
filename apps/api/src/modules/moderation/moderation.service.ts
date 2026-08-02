export class ModerationService {
  private blockedWords: Set<string> = new Set(['badword', 'scam', 'abuse', 'hate']);
  private reports: Map<string, any> = new Map();
  private bannedUsers: Map<string, { reason: string; expiresAt?: Date }> = new Map();

  filterContent(text: string): { isClean: boolean; sanitizedText: string } {
    let sanitizedText = text;
    let isClean = true;

    for (const word of this.blockedWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(sanitizedText)) {
        isClean = false;
        sanitizedText = sanitizedText.replace(regex, '***');
      }
    }

    return { isClean, sanitizedText };
  }

  submitReport(reporterId: string, targetUserId: string, reason: string, roomId?: string) {
    const reportId = `rep-${Date.now()}`;
    const report = { id: reportId, reporterId, targetUserId, reason, roomId, status: 'PENDING', createdAt: new Date() };
    this.reports.set(reportId, report);
    return report;
  }

  banUser(userId: string, reason: string, days?: number): boolean {
    const expiresAt = days ? new Date(Date.now() + days * 86400000) : undefined;
    this.bannedUsers.set(userId, { reason, expiresAt });
    return true;
  }

  isUserBanned(userId: string): boolean {
    const ban = this.bannedUsers.get(userId);
    if (!ban) return false;
    if (ban.expiresAt && ban.expiresAt < new Date()) {
      this.bannedUsers.delete(userId);
      return false;
    }
    return true;
  }
}
