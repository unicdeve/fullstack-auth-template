import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { PrismaService } from 'libs/prisma/prisma.service';

import { SignUpDto } from 'auth/dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BadRequestError } from 'libs/errors/bad-request.error';
import { SignInDto } from 'auth/dto/signin.dto';
import { User } from '@prisma/client';
import { OAuthProvider, OAuthUserType } from 'auth/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  /**
   * @description creates new user in DB
   * @param SignUpDto
   * @returns Promise<AuthTokens>
   */
  async createUser(data: SignUpDto) {
    const salt = await genSalt(
      this.configService.getOrThrow<number>('password_salt'),
    );
    const hashedPassword = await hash(data.password, salt);

    const input = { ...data };

    input.password = hashedPassword;

    try {
      const user = await this.prismaService.user.create({
        data: input,
      });

      delete user.password;

      return user;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw BadRequestError('email', 'User with this email already exists');
        }
      }

      throw new Error(e);
    }
  }

  /**
   * @description creates new user in DB
   * @param SignInDto
   * @returns Promise<AuthTokens>
   */
  async validateUserSignIn(data: SignInDto) {
    let user: User;
    try {
      user = await this.prismaService.user.findUniqueOrThrow({
        where: {
          email: data.email,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw BadRequestError('email', 'User not found');
        }
      }

      throw new Error(e);
    }

    const valid = await this.validatePasswords(user.password, data.password);

    if (!valid) {
      throw BadRequestError('email', 'Login credentials are invalid');
    }

    return user;
  }

  /**
   * @description creates new user in DB
   * @param SignInDto
   * @returns Promise<AuthTokens>
   */
  async getAuthenticatedUser(userId: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
      });

      delete user.password;

      return user;
    } catch (e) {
      return null;
    }
  }

  /**
   * @description creates/updates user in DB based on OAuth type (Facebook or Google)
   * @param res - Express response object
   * @param oAuthUser - The OAuth user data
   * @param provider - 'facebook' or 'google' or 'github'
   * @returns Promise<AuthTokens, User>
   */
  async findOAuthUserOrCreate(
    oAuthUser: OAuthUserType,
    provider: OAuthProvider,
  ): Promise<User> {
    const providerId = `${provider}Id`;

    let user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ [providerId]: oAuthUser.id }, { email: oAuthUser.email }],
      },
    });

    if (user && user.email) {
      // TODO: Do you want to disallow the user if an account with the email was already created? Your choice
      // throw new Error('User with this email already exist?');
    }

    /**
     * Current Implementation = If user exists but is not linked with the OAuth provider, automatically link the user
     */
    if (user && !user[providerId]) {
      user = await this.prismaService.user.update({
        where: { email: oAuthUser.email },
        data: { [providerId]: oAuthUser.id },
      });
    }

    // If no user found, create a new one
    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          [providerId]: oAuthUser.id,
          email: oAuthUser.email,
          firstName: oAuthUser.firstName,
          lastName: oAuthUser.lastName,
        },
      });
    }

    return user;
  }

  /**
   * @description compares savedHashPassowrd and user's password
   * @param authPassword
   * @param password
   * @returns Promise<boolean>
   */
  private async validatePasswords(
    authPassword: string,
    password: string,
  ): Promise<boolean> {
    const isMatch = await compare(password, authPassword).then((same) => same);

    return isMatch;
  }
}
