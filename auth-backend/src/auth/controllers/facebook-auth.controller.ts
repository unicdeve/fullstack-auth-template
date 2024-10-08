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
import { TokenService } from 'auth/services/token.service';
import { ConfigService } from '@nestjs/config';

@Controller('oauth')
@UsePipes(new ValidationPipe({ transform: true }))
export class FacebookAuthContoller {
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * @description facebook oauth client init
   * @param req
   * @returns Promise<void>
   */
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {
    console.log('beginning facebook oauth');
  }

  /**
   * @description facebook oauth redirect after client grant
   * @param req
   * @returns Response
   */
  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(
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
