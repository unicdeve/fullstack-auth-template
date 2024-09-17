import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow<string>('queue_host'),
          port: configService.getOrThrow<number>('queue_port'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class QueueModule {}
