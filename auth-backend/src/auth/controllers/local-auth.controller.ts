import {
  Body,
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { SignUpDto } from 'auth/dto/signup.dto';
import { TokenService } from 'auth/services/token.service';

@Controller('local-auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class LocalAuthContoller {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * @description sign up new user
   * @param SignUpDto
   * @returns Promise<AuthTokens>
   */
  @Post('signup-with-password')
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() signUpDto: SignUpDto,
  ) {
    const user = await this.authService.createUser(signUpDto);
    await this.tokenService.setAuthCookies(res, user);

    return {
      status: 'success',
      data: user,
      meta: null,
    };
  }
}
