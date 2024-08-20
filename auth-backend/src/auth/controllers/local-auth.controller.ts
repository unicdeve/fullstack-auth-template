import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { SignUpDto } from 'auth/dto/signup.dto';
import { TokenService } from 'auth/services/token.service';
import { RequestWithAuthUser, RequestWithPassportUser } from 'auth/auth.types';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';

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

  /**
   * @description signin using email and password
   * @param email
   * @param password
   * @returns Promise<any>
   */
  @UseGuards(AuthGuard('local'))
  @Post('signin-with-password')
  async signIn(@Res() res: Response, @Req() req: RequestWithPassportUser) {
    await this.tokenService.setAuthCookies(res, req.user);

    res.json({
      status: 'success',
      data: req.user,
      meta: null,
    });
  }

  /**
   * @description get authenticated user
   * @param req.authorization
   * @returns Promise<any>
   */
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  public async getUser(@Req() req: RequestWithAuthUser) {
    const userId = req?.user?.userId || '';

    const user = await this.authService.getAuthenticatedUser(userId);

    return {
      status: 'success',
      data: user,
      meta: null,
    };
  }
}
