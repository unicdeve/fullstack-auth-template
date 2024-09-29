import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
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
      from: this.getMailFrom(),
      to: email,
      subject: 'Your Magic Link',
      text: `Click on this link to log in: ${link}`,
      html: `<a href="${link}">Click here to log in</a>`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendForgetPasswordLink(email: string, link: string): Promise<void> {
    const mailOptions = {
      from: this.getMailFrom(),
      to: email,
      subject: 'Auth Template - Reset password',
      text: `Click on this link to reset password: ${link}`,
      html: `<a href="${link}">Click here to reset password</a>`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  private getMailFrom() {
    return `Auth Template <${this.configService.getOrThrow<string>('email_user')}>`;
  }
}
