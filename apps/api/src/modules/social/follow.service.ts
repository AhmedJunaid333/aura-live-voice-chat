export class FollowService {
  private userFollowers: Map<string, Set<string>> = new Map(); // Key: followingId, Value: Set of followerIds

  followUser(followerId: string, followingId: string): { success: boolean; followerCount: number } {
    if (followerId === followingId) throw new Error('Users cannot follow themselves');

    const followerSet = this.userFollowers.get(followingId) || new Set();
    followerSet.add(followerId);
    this.userFollowers.set(followingId, followerSet);

    return { success: true, followerCount: followerSet.size };
  }

  unfollowUser(followerId: string, followingId: string): { success: boolean; followerCount: number } {
    const followerSet = this.userFollowers.get(followingId);
    if (followerSet) {
      followerSet.delete(followerId);
    }
    return { success: true, followerCount: followerSet?.size || 0 };
  }

  getFollowerCount(userId: string): number {
    return this.userFollowers.get(userId)?.size || 0;
  }
}
