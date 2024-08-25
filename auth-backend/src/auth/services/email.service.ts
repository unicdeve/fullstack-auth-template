import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: configService.getOrThrow<string>('email_user'),
        pass: configService.getOrThrow<string>('email_pass'),
      },
    });
  }

  async sendMagicLink(email: string, link: string): Promise<void> {
    const mailOptions = {
      from: this.configService.getOrThrow<string>('email_user'),
      to: email,
      subject: 'Your Magic Link',
      text: `Click on this link to log in: ${link}`,
      html: `<a href="${link}">Click here to log in</a>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
