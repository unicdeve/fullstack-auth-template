import { Controller, Post, Body, Res, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'auth/services/auth.service';
import { EmailService } from 'auth/services/email.service';
import { TokenService } from 'auth/services/token.service';
import { Response } from 'express';
import { BadRequestError } from 'libs/errors/bad-request.error';

@Controller('magic-link')
export class MagicLinkController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

  @Post('request')
  async requestMagicLink(@Body('email') email: string) {
    const user = await this.authService.findUserByEmail(email);

    if (!user) {
      throw BadRequestError('email', 'User with this email does not exist');
    }

    const token = await this.tokenService.generateMagicLinkToken(user);

    const magicLink = `${this.configService.getOrThrow<string>('frontend_client_origin')}/magic-link/verify?token=${token}`;
    // You could use a message-queueing system (like RabbitMQ) to manage Nodemailer email messages.
    await this.emailService.sendMagicLink(user.email, magicLink);

    return {
      status: 'success',
      data: null,
      meta: null,
    };
  }

  @Get('verify')
  async verifyMagicLink(
    @Query('token') token: string,
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
