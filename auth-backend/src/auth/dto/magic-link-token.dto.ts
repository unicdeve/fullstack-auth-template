import { IsJWT } from 'class-validator';

export class MagicLinkTokenDto {
  @IsJWT({ message: 'Invalid token.' })
  readonly token: string;
}
