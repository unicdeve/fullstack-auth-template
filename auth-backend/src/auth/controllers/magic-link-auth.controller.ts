import { Controller, Post, Body, Res, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  MagicLinkRequestDto,
  MagicLinkTokenDto,
} from 'auth/dto/magic-link.dto';
import { AuthService } from 'auth/services/auth.service';
import { TokenService } from 'auth/services/token.service';
import { Response } from 'types';
import { BadRequestError } from 'libs/errors/bad-request.error';
import { MailerQueueService } from 'libs/mailer/mailer-queue.service';

@Controller('magic-link')
export class MagicLinkController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly mailerQueueService: MailerQueueService,
  ) {}

  @Post('request')
  async requestMagicLink(@Body() { email }: MagicLinkRequestDto) {
    const user = await this.authService.findUserByEmail(email);

    if (!user) {
      throw BadRequestError('email', 'User with this email does not exist');
    }

    const token = await this.tokenService.generateMagicLinkToken(user);
    const magicLink = `${this.configService.getOrThrow<string>('frontend_client_origin')}/magic-link/verify?token=${token}`;

    await this.mailerQueueService.addMagicLink(user.email, magicLink);

    return {
      status: 'success',
      data: null,
      meta: null,
    };
  }

  @Get('verify')
  async verifyMagicLink(
    @Query() { token }: MagicLinkTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const payload = await this.tokenService.verifyMagicLinkToken(token);

    const user = await this.authService.findUserById(payload.userId);

    await this.tokenService.setAuthCookies(res, user);

    return {
      status: 'success',
      data: null,
      meta: null,
    };
  }
}
