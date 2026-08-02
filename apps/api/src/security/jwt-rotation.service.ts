export class JwtRotationService {
  private activeKeys: Map<string, { secret: string; issuedAt: Date }> = new Map();

  constructor() {
    this.rotateKeys();
  }

  rotateKeys(): string {
    const keyId = `key-v${Date.now()}`;
    const secret = `prod_jwt_secret_${Math.random().toString(36).substring(2, 15)}`;
    this.activeKeys.set(keyId, { secret, issuedAt: new Date() });
    return keyId;
  }

  getActiveKey(): { keyId: string; secret: string } {
    const entries = Array.from(this.activeKeys.entries());
    const latest = entries[entries.length - 1];
    return { keyId: latest[0], secret: latest[1].secret };
  }
}
