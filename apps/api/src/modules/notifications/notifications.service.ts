import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Resend } from 'resend';
import { EmailTemplateData } from '@/notifications/models/email-template.type';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { Notification } from './models/notification.type';
import { NotificationDocument, NotificationEntity } from './schemas/notification.schema';
import { Model } from 'mongoose';
import { referralCreatedEmailHTML } from './templates/referral-created.email';
import { referralCollectedEmailHTML } from './templates/referral-collected.email';
import { referralNotCollectedEmailHTML } from './templates/referral-not-collected.email';
import { referralRejectedEmailHTML } from './templates/referral-rejected.email';
import { referralWithdrawnEmailHTML } from './templates/referral-withdrawn.email';

@Injectable()
export class NotificationsService {
  private resend: Resend;
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @Inject(NotificationEntity.name)
    private notificationModel: Model<NotificationDocument>,
  ) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not defined in the environment.');
    }
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  private emailTemplates = {
    referralCreated: (data: EmailTemplateData) => referralCreatedEmailHTML,
    referralCollected: (data: EmailTemplateData) => referralCollectedEmailHTML,
    referralNotCollected: (data: EmailTemplateData) => referralNotCollectedEmailHTML,
    referralReady: (data: EmailTemplateData) => referralCreatedEmailHTML,
    referralRejected: (data: EmailTemplateData) => referralRejectedEmailHTML,
    referralWithdrawn: (data: EmailTemplateData) => referralWithdrawnEmailHTML,
  };

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = new this.notificationModel({ ...createNotificationDto });
    return notification.save();
  }

  async createMany(createNotificationDtos: Array<CreateNotificationDto>): Promise<void> {
    await this.notificationModel.insertMany(createNotificationDtos);
  }

  async findAll(): Promise<Array<Notification>> {
    return this.notificationModel.find().exec();
  }

  async findOne(id: string): Promise<Notification | null> {
    return this.notificationModel.findById({ _id: id }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.notificationModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
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
