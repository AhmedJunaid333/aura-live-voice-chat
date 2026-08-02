// Admin Live Controller (/api/v1/admin/live)
import { AdminAuditService } from '../modules/admin/audit.service.js';

export class AdminLiveController {
  private audit = new AdminAuditService();

  async getActiveRooms(countryCode?: string) {
    return {
      success: true,
      data: [
        { roomId: 'room-101', roomNumber: '888999', title: '🔥 Late Night Party', hostId: 'u-101', countryCode: 'PK', viewers: 450, seatsOccupied: 8, giftsPerMin: 120 }
      ]
    };
  }

  async terminateRoom(adminId: string, roomId: string, reason: string) {
    await this.audit.logAction({
      adminId,
      action: 'FORCE_CLOSE_ROOM',
      targetType: 'LIVE_ROOM',
      targetId: roomId,
      newValue: { reason }
    });

    return {
      success: true,
      message: `Room ${roomId} forcefully terminated`
    };
  }
}
