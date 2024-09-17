export enum MailerJobNameEmum {
  SEND_MAGIC_LINK = 'request-magic-link',
  SEND_FORGOT_PASSWORD_LINK = 'send-reset-password',
}

export type EmailLinkJobData = {
  email: string;
  link: string;
};
