import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { PrismaService } from 'libs/prisma/prisma.service';

import { SignUpDto } from 'auth/dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BadRequestError } from 'libs/errors/bad-request.error';
import { SignInDto } from 'auth/dto/signin.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}
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
