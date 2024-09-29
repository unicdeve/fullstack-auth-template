import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { MailerJobNameEmum } from './mailer.type';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueNameEnum } from 'libs/queue/queue.type';

@Injectable()
export class MailerQueueService {
  constructor(@InjectQueue(QueueNameEnum.MAILER) private emailQueue: Queue) {}

  async addMagicLink(email: string, link: string) {
    await this.emailQueue.add(MailerJobNameEmum.SEND_MAGIC_LINK, {
      email,
      link,
    });
  }

  async addForgetPasswordLink(email: string, link: string) {
    await this.emailQueue.add(MailerJobNameEmum.SEND_FORGOT_PASSWORD_LINK, {
      email,
      link,
    });
  }
}
