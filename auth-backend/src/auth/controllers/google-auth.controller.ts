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

import { Response } from 'types';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithPassportUser } from 'auth/auth.types';
import { ConfigService } from '@nestjs/config';
import { TokenService } from 'auth/services/token.service';

@Controller('oauth')
@UsePipes(new ValidationPipe({ transform: true }))
export class GoogleAuthContoller {
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * @description google oauth client init
   * @param req
   * @returns Promise<void>
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    console.log('beginning google oauth');
  }

  /**
   * @description google oauth redirect after client grant
   * @param req
   * @returns Promise
   */
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: RequestWithPassportUser,
    @Res() res: Response,
  ) {
    await this.tokenService.setAuthCookies(res, req.user);

    res
      .status(HttpStatus.FOUND)
      .redirect(
        this.configService.getOrThrow<string>('frontend_client_origin'),
      );
  }
}
