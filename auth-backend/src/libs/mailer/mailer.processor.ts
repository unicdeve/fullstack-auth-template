import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { MailerJobNameEmum, EmailLinkJobData } from './mailer.type';
import { MailerService } from './mailer.service';
import { QueueNameEnum } from 'libs/queue/queue.type';

@Processor(QueueNameEnum.MAILER)
export class MailerProcessor extends WorkerHost {
  private readonly logger = new Logger(MailerProcessor.name);

  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<EmailLinkJobData>): Promise<any> {
    switch (job.name) {
      case MailerJobNameEmum.SEND_MAGIC_LINK: {
        const { email, link } = job.data;

        await this.mailerService.sendMagicLink(email, link);

        return;
      }

      case MailerJobNameEmum.SEND_FORGOT_PASSWORD_LINK: {
        const { email, link } = job.data;

        await this.mailerService.sendForgetPasswordLink(email, link);

        return;
      }

      default: {
        this.logger.error(`Unknown job type: ${job.name}`);

        throw new Error(`Unknown job type: ${job.name}`);
      }
    }
  }
}
