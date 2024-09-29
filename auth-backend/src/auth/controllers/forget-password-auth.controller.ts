import { Controller, Post, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from 'auth/dto/reset-password.dto';
import { AuthService } from 'auth/services/auth.service';
import { TokenService } from 'auth/services/token.service';
import { BadRequestError } from 'libs/errors/bad-request.error';
import { MailerQueueService } from 'libs/mailer/mailer-queue.service';

@Controller('forget-password')
export class ForgetPasswordAuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly mailerQueueService: MailerQueueService,
  ) {}

  /**
   * @description request for reset password link
   * @param email
   * @returns Response
   */
  @Post()
  async requestResetPasswordLink(@Body('email') email: string) {
    const user = await this.authService.findUserByEmail(email);

    if (!user) {
      throw BadRequestError('email', 'User with this email does not exist');
    }

    const token = await this.tokenService.generateResetPasswordLinkToken(user);

    const resetPasswordLink = `${this.configService.getOrThrow<string>('frontend_client_origin')}/forget-password/reset?token=${token}`;
    await this.mailerQueueService.addForgetPasswordLink(
      user.email,
      resetPasswordLink,
    );

    return {
      status: 'success',
      data: null,
      meta: null,
    };
  }

  /**
   * @description sets new password
   * @param ResetPasswordDto
   * @returns Response
   */
  @Post('reset')
  async resetPassword(
    @Body() body: ResetPasswordDto,
    // @Res({ passthrough: true }) res: Response,
  ) {
    const payload = await this.tokenService.verifyResetPasswordLinkToken(
      body.token,
    );

    await this.authService.updateUserPassword({
      userId: payload.userId,
      newPassword: body.newPassword,
    });

    // You could decide to logged the user in automatically
    // await this.tokenService.setAuthCookies(res, user);

    return {
      status: 'success',
      data: null,
      meta: null,
    };
  }
}
