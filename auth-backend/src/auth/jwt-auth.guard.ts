import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import {
  ACCESS_TOKEN_COOKIE_ID,
  REFRESH_TOKEN_COOKIE_ID,
} from 'utils/constants';
import { JwtTokenPayload } from './auth.types';
import { TokenService } from './services/token.service';
import { AuthService } from './services/auth.service';

type TokensType = {
  accessToken?: string | undefined;
  refreshToken?: string | undefined;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { accessToken, refreshToken } =
      this.extractTokensFromCookieOrHeader(request);

    if (!accessToken) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtTokenPayload>(
        accessToken,
        {
          secret: this.configService.getOrThrow('access_token_secret'),
        },
      );

      request['user'] = payload;

      return true;
    } catch {
      // token is expired or signed with a different secret
      // so now check refresh token
    }

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    let data: JwtTokenPayload;
    try {
      data = await this.jwtService.verifyAsync<JwtTokenPayload>(refreshToken, {
        secret: this.configService.getOrThrow('refresh_token_secret'),
      });
    } catch {
      throw new UnauthorizedException();
    }

    /**
     * You could decide not check the refreshTokenVersion, and in turn not query the User table at all
     * Thereby, relying on the fact that your refreshToken is valid, just sign new ones, no problem, ahaha
     */
    const user = await this.authService.findUserById(data.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    // Set new tokens since accessToken has expired
    await this.tokenService.setAuthCookies(response, user);

    request['user'] = data;

    return true;
  }

  private extractTokensFromCookieOrHeader(request: Request): TokensType {
    let tokens: TokensType = this.extractTokenFromCookies(request);

    if (!tokens.accessToken && !tokens.refreshToken) {
      tokens = this.extractTokensFromHeader(request);
    }

    return tokens;
  }

  private extractTokenFromCookies(request: Request): TokensType {
    const aCookie = request.cookies[ACCESS_TOKEN_COOKIE_ID];
    const [aType, aToken] = aCookie?.split(' ') ?? [];
    const accessToken = aType === 'Bearer' ? aToken : undefined;

    const rCookie = request.cookies[REFRESH_TOKEN_COOKIE_ID];
    const [rType, rToken] = rCookie?.split(' ') ?? [];
    const refreshToken = rType === 'Bearer' ? rToken : undefined;

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * 
   * @param request 
   * @returns 
   *  Headers should be set like this
   * headers: {
      'Authorization': `Bearer ${accessToken},${refreshToken}`
    },
   */
  private extractTokensFromHeader(request: Request): TokensType {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return {};
    }

    const [bearer, tokens] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !tokens) {
      return {};
    }

    const [accessToken, refreshToken] = tokens.split(',');

    return {
      accessToken,
      refreshToken,
    };
  }
}
