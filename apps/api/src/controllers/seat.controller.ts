// Seat Controller (/api/v1/seat)
import { SeatRequestDto, ApproveSeatDto } from '../../../../packages/shared-types/src/index.js';

export class SeatController {
  async requestSeat(userId: string, body: SeatRequestDto): Promise<{ success: boolean; requestId: string; message: string }> {
    return {
      success: true,
      requestId: `seat-req-${Date.now()}`,
      message: 'Speaker seat request sent to room host'
    };
  }

  async approveSeat(hostId: string, body: ApproveSeatDto): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: body.approve
        ? `User ${body.userId} approved for seat ${body.seatIndex}`
        : `User ${body.userId} seat request rejected`
    };
  }
}
