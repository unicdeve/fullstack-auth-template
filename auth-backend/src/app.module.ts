import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'libs/prisma/prisma.module';
import { QueueModule } from 'libs/queue/queue.module';
import { config } from 'config';
import { AuthModule } from 'auth/auth.module';
import { SecretModule } from 'libs/secret/secret.module';
import { seconds, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ApiThrottlerGuard } from 'api-throttler.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      cache: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: seconds(1),
        limit: 2,
      },
      {
        name: 'medium',
        ttl: seconds(10),
        limit: 15,
      },
      {
        name: 'long',
        ttl: seconds(60),
        limit: 40,
      },
    ]),
    QueueModule,
    ScheduleModule.forRoot(),
    SecretModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiThrottlerGuard,
    },
    AppService,
  ],
})
export class AppModule {}
