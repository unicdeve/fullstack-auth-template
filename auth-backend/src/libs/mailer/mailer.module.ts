import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { ConfigModule } from '@nestjs/config';
import { MailerProcessor } from './mailer.processor';
import { MailerQueueService } from './mailer-queue.service';
import { MailerService } from './mailer.service';
import { QueueNameEnum } from 'libs/queue/queue.type';

@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueue({
      name: QueueNameEnum.MAILER,
    }),
  ],
  providers: [MailerProcessor, MailerService, MailerQueueService],
  exports: [MailerQueueService],
})
export class MailerModule {}
