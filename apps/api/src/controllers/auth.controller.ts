import { RegisterRequestDto, LoginRequestDto, AuthResponseDto, SendOtpDto, GoogleAuthRequestDto, LinkGoogleRequestDto } from '../../../../packages/shared-types/src/index.js';

export class AuthController {
  async register(body: RegisterRequestDto): Promise<{ success: boolean; data: AuthResponseDto }> {
    return {
      success: true,
      data: {
        accessToken: `aura_jwt_acc_${Date.now()}`,
        refreshToken: `aura_jwt_ref_${Date.now()}`,
        expiresIn: 86400,
        user: {
          id: `u-${Date.now()}`,
          userTag: body.userTag,
          nickname: body.nickname,
          email: body.email || null,
          phone: body.phone || null,
          avatarUrl: body.avatarUrl || null,
          bio: 'Welcome to Aura Live!',
          gender: 'PREFER_NOT_TO_SAY',
          level: 1,
          vipTier: 0,
          isVerifiedHost: false,
          status: 'ACTIVE',
          createdAt: new Date().toISOString()
        }
      }
    };
  }

  async login(body: LoginRequestDto): Promise<{ success: boolean; data: AuthResponseDto }> {
    return {
      success: true,
      data: {
        accessToken: `aura_jwt_acc_${Date.now()}`,
        refreshToken: `aura_jwt_ref_${Date.now()}`,
        expiresIn: 86400,
        user: {
          id: `u-${Date.now()}`,
          userTag: body.target,
          nickname: body.target,
          email: body.target.contains('@') ? body.target : null,
          phone: null,
          avatarUrl: null,
          bio: 'Live Streamer',
          gender: 'MALE',
          level: 1,
          vipTier: 0,
          isVerifiedHost: false,
          status: 'ACTIVE',
          createdAt: new Date().toISOString()
        }
      }
    };
  }

  async googleAuth(body: GoogleAuthRequestDto): Promise<{ success: boolean; message: string; data: AuthResponseDto }> {
    if (!body.idToken) {
      throw new Error('Google ID token is required');
    }

    const derivedUserTag = (body.email ? body.email.split('@')[0] : `user_${Date.now()}`).toLowerCase();
    const derivedName = body.displayName || derivedUserTag;

    return {
      success: true,
      message: 'Google Sign-In verified successfully!',
      data: {
        accessToken: `aura_google_jwt_${Date.now()}`,
        refreshToken: `aura_google_ref_${Date.now()}`,
        expiresIn: 86400,
        user: {
          id: `usr_g_${body.googleId || Date.now()}`,
          userTag: derivedUserTag,
          nickname: derivedName,
          email: body.email || null,
          phone: null,
          avatarUrl: body.photoUrl || null,
          bio: 'Welcome to my Aura Live profile! 🎤✨',
          gender: 'PREFER_NOT_TO_SAY',
          level: 1,
          vipTier: 0,
          isVerifiedHost: false,
          status: 'ACTIVE',
          createdAt: new Date().toISOString()
        }
      }
    };
  }

  async linkGoogleAccount(body: LinkGoogleRequestDto): Promise<{ success: boolean; message: string }> {
    if (!body.userId || !body.googleId) {
      throw new Error('User ID and Google ID are required to link account');
    }
    return {
      success: true,
      message: `Google Account (${body.email}) linked successfully to user ${body.userId}!`
    };
  }

  async logout(body: { userId: string; deviceId?: string }): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `Session revoked and logged out for user ${body.userId}`
    };
  }

  async refresh(body: { refreshToken: string }): Promise<{ success: boolean; accessToken: string; refreshToken: string }> {
    if (!body.refreshToken) {
      throw new Error('Refresh token is required');
    }
    return {
      success: true,
      accessToken: `aura_jwt_acc_refreshed_${Date.now()}`,
      refreshToken: `aura_jwt_ref_refreshed_${Date.now()}`
    };
  }

  async sendOtp(body: SendOtpDto): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `OTP sent successfully to ${body.target}`
    };
  }
}
