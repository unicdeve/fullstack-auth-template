import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { User } from '@prisma/client';

import { ConfigService } from '@nestjs/config';
import {
  IS_PROD,
  ACCESS_TOKEN_COOKIE_ID,
  REFRESH_TOKEN_COOKIE_ID,
} from 'utils/constants';
import { Response } from 'express';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private configService: ConfigService,
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
   * @description generates access token
   * @param User
   * @returns Promise<string>
   */
  private async generateAccessToken(user: User): Promise<string> {
    /**
     * Access token should be short live
     * Make sure to set short expiration time, like 5mins, 10mins, 15mins, etc, depending on your application
     */
    const signOptions: JwtSignOptions = {
      ...this.getBaseOptions(),
      expiresIn: this.configService.getOrThrow<string>(
        'access_token_expires_in',
      ),
      secret: this.configService.getOrThrow<string>('access_token_secret'),
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
   * @description generates refresh token
   * @param user
   * @returns Promise<string>
   */
  private async generateRefreshToken(user: User): Promise<string> {
    /**
     * Refresh token can be long live
     * Could be 3mon, 6mon, 1yr, etc
     */
    const signOptions: JwtSignOptions = {
      ...this.getBaseOptions(),
      expiresIn: this.configService.getOrThrow<string>(
        'refresh_token_expires_in',
      ),
      secret: this.configService.getOrThrow<string>('refresh_token_secret'),
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
        ? `${this.configService.getOrThrow<string>('domain')}`
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
}
