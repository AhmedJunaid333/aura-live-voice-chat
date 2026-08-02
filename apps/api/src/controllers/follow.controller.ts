// Follow Controller (/api/v1/users/:id/follow)
import { FollowService } from '../modules/social/follow.service.js';

export class FollowController {
  private followService = new FollowService();

  async followUser(followerId: string, targetUserId: string) {
    const res = this.followService.followUser(followerId, targetUserId);
    return {
      success: true,
      message: `Now following user ${targetUserId}`,
      followerCount: res.followerCount
    };
  }

  async unfollowUser(followerId: string, targetUserId: string) {
    const res = this.followService.unfollowUser(followerId, targetUserId);
    return {
      success: true,
      message: `Unfollowed user ${targetUserId}`,
      followerCount: res.followerCount
    };
  }
}
