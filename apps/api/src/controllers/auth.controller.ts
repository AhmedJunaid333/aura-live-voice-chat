// Auth Controller (/api/v1/auth)
import { RegisterRequestDto, LoginRequestDto, AuthResponseDto, SendOtpDto } from '../../../../packages/shared-types/src/index.js';

export class AuthController {
  async register(body: RegisterRequestDto): Promise<{ success: boolean; data: AuthResponseDto }> {
    // Production registration logic
    return {
      success: true,
      data: {
        accessToken: 'mock_jwt_access_token_aura',
        refreshToken: 'mock_jwt_refresh_token_aura',
        expiresIn: 86400,
        user: {
          id: 'u-1001-uuid',
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
    // Production login logic
    return {
      success: true,
      data: {
        accessToken: 'mock_jwt_access_token_aura',
        refreshToken: 'mock_jwt_refresh_token_aura',
        expiresIn: 86400,
        user: {
          id: 'u-1001-uuid',
          userTag: 'aura_user_1',
          nickname: 'Aura Member',
          email: body.target,
          phone: null,
          avatarUrl: null,
          bio: 'Live Streamer',
          gender: 'MALE',
          level: 5,
          vipTier: 1,
          isVerifiedHost: true,
          status: 'ACTIVE',
          createdAt: new Date().toISOString()
        }
      }
    };
  }

  async sendOtp(body: SendOtpDto): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `OTP sent successfully to ${body.target}`
    };
  }
}
