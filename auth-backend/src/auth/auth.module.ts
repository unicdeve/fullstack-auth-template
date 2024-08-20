import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'libs/prisma/prisma.module';

import { LocalAuthContoller } from './controllers/local-auth.controller';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('access_token_secret'),
        signOptions: {
          expiresIn: configService.get<string>('access_token_expires_in'),
        },
      }),
    }),
  ],
  controllers: [LocalAuthContoller],
  providers: [AuthService, TokenService, LocalStrategy],
})
export class AuthModule {}
