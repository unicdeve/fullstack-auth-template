import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from 'libs/prisma/prisma.module';
import { SecretModule } from 'libs/secret/secret.module';

import { LocalAuthContoller } from './controllers/local-auth.controller';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleAuthContoller } from './controllers/google-auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { FacebookAuthContoller } from './controllers/facebook-auth.controller';
import { GithubStrategy } from './strategies/github.strategy';
import { GithubAuthContoller } from './controllers/github-auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { MagicLinkController } from './controllers/magic-link-auth.controller';
import { ForgetPasswordAuthController } from './controllers/forget-password-auth.controller';
import { MailerModule } from 'libs/mailer/mailer.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    SecretModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>(
          'access_token.secrets.current.secret',
        ),
        signOptions: {
          expiresIn: configService.getOrThrow<string>(
            'access_token.expires_in',
          ),
        },
      }),
    }),
    MailerModule,
  ],
  controllers: [
    LocalAuthContoller,
    GoogleAuthContoller,
    FacebookAuthContoller,
    GithubAuthContoller,
    MagicLinkController,
    ForgetPasswordAuthController,
  ],
  providers: [
    AuthService,
    TokenService,
    GoogleStrategy,
    FacebookStrategy,
    GithubStrategy,
    LocalStrategy,
  ],
})
export class AuthModule {}
