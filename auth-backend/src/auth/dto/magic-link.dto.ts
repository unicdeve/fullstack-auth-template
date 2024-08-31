import { IsEmail, IsJWT } from 'class-validator';

export class MagicLinkRequestDto {
  @IsEmail({}, { message: 'Enter a valid email addresss' })
  readonly email: string;
}

export class MagicLinkTokenDto {
  @IsJWT({ message: 'Invalid token.' })
  readonly token: string;
}
