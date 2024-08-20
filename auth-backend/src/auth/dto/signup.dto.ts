import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({
    message: 'Email is required.',
  })
  @IsEmail({}, { message: 'Enter a valid email addresss' })
  readonly email: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  readonly firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  readonly lastName: string;

  @IsNotEmpty({
    message: 'Password is required.',
  })
  @IsString()
  readonly password: string;
}
