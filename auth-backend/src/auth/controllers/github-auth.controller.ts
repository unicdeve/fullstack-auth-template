import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithPassportUser } from 'auth/auth.types';
import { ConfigService } from '@nestjs/config';
import { TokenService } from 'auth/services/token.service';

@Controller('oauth')
@UsePipes(new ValidationPipe({ transform: true }))
export class GithubAuthContoller {
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * @description github oauth client init
   * @param req
   * @returns Promise<void>
   */
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    console.log('beginning github oauth');
  }

  /**
   * @description github oauth redirect after client grant
   * @param req
   * @returns Promise
   */
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(
    @Req() req: RequestWithPassportUser,
    @Res() res: Response,
  ) {
    await this.tokenService.setAuthCookies(res, req.user);

    res
      .status(HttpStatus.OK)
      .redirect(
        this.configService.getOrThrow<string>('foontend_client_origin'),
      );
  }
}
