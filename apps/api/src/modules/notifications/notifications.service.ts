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
import {
  NotificationEntity,
} from './schemas/notification.schema';
import { Model } from 'mongoose';
import { referralCreatedEmailHTML } from './templates/referral-created.email';
import { referralCollectedEmailHTML } from './templates/referral-collected.email';
import { referralNotCollectedEmailHTML } from './templates/referral-not-collected.email';
import { referralRejectedEmailHTML } from './templates/referral-rejected.email';
import { referralWithdrawnEmailHTML } from './templates/referral-withdrawn.email';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class NotificationsService {
  private resend: Resend;
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(NotificationEntity.name)
    private notificationModel: Model<NotificationEntity>,
  ) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not defined in the environment.');
    }
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  private emailTemplates = {
    referralCreated: () => referralCreatedEmailHTML,
    referralCollected: () => referralCollectedEmailHTML,
    referralNotCollected: () => referralNotCollectedEmailHTML,
    referralReady: () => referralCreatedEmailHTML,
    referralRejected: () => referralRejectedEmailHTML,
    referralWithdrawn: () => referralWithdrawnEmailHTML,
  };

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = new this.notificationModel({
      ...createNotificationDto,
      isRead: createNotificationDto.isRead ?? false,
      isEmailSent: false,
    });
    return notification.save();
  }

  async createMany(
    createNotificationDtos: Array<CreateNotificationDto>,
  ): Promise<void> {
    const notifications = createNotificationDtos.map(dto => ({
      ...dto,
      isRead: dto.isRead ?? false,
      isEmailSent: false,
    }));
    await this.notificationModel.insertMany(notifications);
  }

  async findAll(): Promise<Array<Notification>> {
    return this.notificationModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByRecipient(
    recipientId: string,
    limit: number = 50,
    skip: number = 0,
  ): Promise<Array<Notification>> {
    return this.notificationModel
      .find({ recipientId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async findUnreadByRecipient(recipientId: string): Promise<Array<Notification>> {
    return this.notificationModel
      .find({ recipientId, isRead: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getUnreadCount(recipientId: string): Promise<number> {
    return this.notificationModel.countDocuments({ recipientId, isRead: false });
  }

  async markAsRead(id: string): Promise<Notification | null> {
    return this.notificationModel
      .findByIdAndUpdate(
        id,
        { isRead: true, readAt: new Date() },
        { new: true }
      )
      .exec();
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    await this.notificationModel
      .updateMany(
        { recipientId, isRead: false },
        { isRead: true, readAt: new Date() }
      )
      .exec();
  }

  async findOne(id: string): Promise<Notification | null> {
    return this.notificationModel.findById(id).exec();
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
      const emailHTML = templateFn();
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
