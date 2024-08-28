import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { User } from '@prisma/client';

import { ConfigService } from '@nestjs/config';
import {
  IS_PROD,
  ACCESS_TOKEN_COOKIE_ID,
  REFRESH_TOKEN_COOKIE_ID,
} from 'utils/constants';
import { SecretKeyId, SecretService } from 'libs/secret/secret.service';
import { Response } from 'express';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private configService: ConfigService,
    private secretService: SecretService,
  ) {}

  private getBaseOptions(): JwtSignOptions {
    return {
      issuer: this.configService.getOrThrow<string>('jwt_issuer'),
      audience: [this.configService.getOrThrow<string>('jwt_audience')],
      header: {
        alg: 'HS256',
      },
    };
  }

  /**
   * Access token should be short live
   * Make sure to set short expiration time, like 5mins, 10mins, 15mins, etc, depending on your application
   * @description generates access token
   * @param User
   * @returns Promise<string>
   */
  private async generateAccessToken(user: User): Promise<string> {
    const currentSecret = this.secretService.getCurrent(
      SecretKeyId.AccessToken,
    );

    const signOptions: JwtSignOptions = {
      ...this.getBaseOptions(),
      expiresIn: this.configService.getOrThrow<string>(
        'access_token.expires_in',
      ),
      secret: currentSecret,
      subject: user.id,
    };

    return this.jwt.signAsync(
      {
        userId: user.id,
      },
      signOptions,
    );
  }

  /**
   * Refresh token can be long live
   * Could be 3mon, 6mon, 1yr, etc
   * @description generates refresh token
   * @param user
   * @returns Promise<string>
   */
  private async generateRefreshToken(user: User): Promise<string> {
    const currentSecret = this.secretService.getCurrent(
      SecretKeyId.RefreshToken,
    );

    const signOptions: JwtSignOptions = {
      ...this.getBaseOptions(),
      expiresIn: this.configService.getOrThrow<string>(
        'refresh_token.expires_in',
      ),
      secret: currentSecret,
      subject: user.id,
    };

    return await this.jwt.signAsync(
      {
        userId: user.id,
      },
      signOptions,
    );
  }

  /**
   * @description generates access and refresh tokens; set the cookies
   * @param user
   * @returns Promise<AuthTokens>
   */
  async setAuthCookies(res: Response, user: User) {
    const cookieOptions = {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'lax',
      path: '/',
      domain: IS_PROD
        ? `.${this.configService.getOrThrow<string>('domain')}`
        : '',
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    } as const;

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    // Cookie is set for web based apps
    res
      .cookie(ACCESS_TOKEN_COOKIE_ID, `Bearer ${accessToken}`, cookieOptions)
      .cookie(REFRESH_TOKEN_COOKIE_ID, `Bearer ${refreshToken}`, cookieOptions);
  }

  /**
   * @description deletes access and refresh tokens from cookies
   * @param res
   * @returns void
   */
  deleteAuthCookies(res: Response) {
    res
      .clearCookie(ACCESS_TOKEN_COOKIE_ID)
      .clearCookie(REFRESH_TOKEN_COOKIE_ID);
  }

  async generateMagicLinkToken(user: User): Promise<string> {
    const currentSecret = this.secretService.getCurrent(SecretKeyId.MagicLink);

    const signOptions: JwtSignOptions = {
      ...this.getBaseOptions(),
      expiresIn: this.configService.getOrThrow<string>('magic_link.expires_in'),
      secret: currentSecret,
      subject: user.id,
    };

    return this.jwt.signAsync(
      {
        userId: user.id,
      },
      signOptions,
    );
  }

  async verifyMagicLinkToken(token: string) {
    try {
      const payload = await this.verifyToken<{ userId: string }>({
        token,
        keyId: SecretKeyId.MagicLink,
      });

      return payload;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired magic link');
    }
  }

  async generateResetPasswordLinkToken(user: User): Promise<string> {
    const currentSecret = this.secretService.getCurrent(
      SecretKeyId.ResetPasswordLink,
    );
    const signOptions: JwtSignOptions = {
      ...this.getBaseOptions(),
      expiresIn: this.configService.getOrThrow<string>(
        'reset_password_link.expires_in',
      ),
      secret: currentSecret,
      subject: user.id,
    };

    return this.jwt.signAsync(
      {
        userId: user.id,
      },
      signOptions,
    );
  }

  async verifyResetPasswordLinkToken(token: string) {
    try {
      const payload = await this.verifyToken<{ userId: string }>({
        token,
        keyId: SecretKeyId.ResetPasswordLink,
      });

      return payload;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired reset password link');
    }
  }

  async verifyToken<T>(props: {
    keyId: SecretKeyId;
    token: string;
  }): Promise<T> {
    const secrets = this.secretService.get(props.keyId);
    // Try verifying first with current secret
    try {
      return this.jwt.verifyAsync(props.token, {
        secret: secrets.current,
      }) as T;
    } catch {
      // Token could be expired/malform/signed with other keys
    }

    try {
      return this.jwt.verifyAsync(props.token, {
        secret: secrets.previous,
      }) as T;
    } catch (e) {
      throw new Error('Token is expired or malformed');
    }
  }
}
