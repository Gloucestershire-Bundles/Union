import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, collection: 'notifications' })
export class NotificationEntity {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  link?: string;

  @Prop({ required: true, index: true })
  recipientId: string;

  @Prop({ required: true, index: true })
  type: string;

  @Prop({ default: false, index: true })
  isRead: boolean;

  @Prop({ default: false })
  isEmailSent: boolean;

  @Prop()
  emailSentAt?: Date;

  @Prop()
  readAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const NotificationSchema =
  SchemaFactory.createForClass(NotificationEntity);

NotificationSchema.index({ recipientId: 1, createdAt: -1 });
NotificationSchema.index({ recipientId: 1, isRead: 1 });
NotificationSchema.index({ type: 1, createdAt: -1 });

export type NotificationDocument = HydratedDocument<NotificationEntity>;
