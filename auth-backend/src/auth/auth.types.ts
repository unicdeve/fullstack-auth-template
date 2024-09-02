import { User } from '@prisma/client';
import { Request } from 'express';

export type JwtTokenPayload = {
  userId: string;
  authTokenVersion: number | null | undefined;
};

export type OAuthProvider = 'google' | 'facebook' | 'github';

export type OAuthUserType = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
};

export interface RequestWithPassportUser extends Request {
  user: User;
}

export interface RequestWithAuthUser extends Request {
  user: JwtTokenPayload;
}

export type VerifyCallback = (
  err?: Error | null | unknown,
  user?: Express.User | false,
  info?: object,
) => void;

export type UpdateUserPasswordType = {
  userId: string;
  newPassword: string;
};
