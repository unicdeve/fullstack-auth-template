import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsJWT({ message: 'Invalid token.' })
  readonly token: string;

  @IsNotEmpty({
    message: 'New Password is required.',
  })
  @IsString()
  readonly newPassword: string;
}
