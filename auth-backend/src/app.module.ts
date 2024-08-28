import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'libs/prisma/prisma.module';
import { config } from 'config';
import { AuthModule } from 'auth/auth.module';
import { SecretModule } from 'libs/secret/secret.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      cache: true,
    }),
    ScheduleModule.forRoot(),
    SecretModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
