import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsNotEmpty({
    message: 'Email is required.',
  })
  @IsEmail({}, { message: 'Enter a valid email addresss' })
  readonly email: string;

  @IsNotEmpty({
    message: 'Password is required.',
  })
  @IsString()
  readonly password: string;
}
