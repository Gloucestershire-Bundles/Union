import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Resend } from 'resend';
import { createReferralEmailHTML } from './templates/create-referral.email';
import { EmailTemplateData } from '@/notifications/models/email-template.type';

@Injectable()
export class NotificationsService {
  private resend: Resend;
  private readonly logger = new Logger(NotificationsService.name);

  private emailTemplates = {
    createReferral: (data: EmailTemplateData) => createReferralEmailHTML,
  };

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not defined in the environment.');
    }
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail(
    to: string,
    subject: string,
    template: keyof typeof this.emailTemplates,
    data: EmailTemplateData,
  ): Promise<void> {
    const templateFn = this.emailTemplates[template];
    if (!templateFn) {
      this.logger.error(`Email template "${template}" not found.`);
      throw new InternalServerErrorException('Invalid template.');
    }

    try {
      const emailHTML = templateFn(data);
      const { error } = await this.resend.emails.send({
        from: 'Gloucestershire Bundles <noreply@gloucestershirebundles.org>',
        to: [to],
        subject: subject,
        html: emailHTML,
      });

      if (error) {
        this.logger.error('Error sending email:', error);
        throw new InternalServerErrorException('Failed to send email.');
      }

      this.logger.log('Email sent successfully!', data);
    } catch (error) {
      this.logger.error(
        'An unexpected error occurred in sending email:',
        error,
      );
      throw new InternalServerErrorException('Failed to send email.');
    }
  }
}
