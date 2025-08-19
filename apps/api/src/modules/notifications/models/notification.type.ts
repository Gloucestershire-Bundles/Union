import { Types } from 'mongoose';

export type Notification = {
  _id?: string | Types.ObjectId;
  title: string;
  description: string;
  link?: string;
  recipientId: string;
  type: string;
  isRead: boolean;
  isEmailSent: boolean;
  emailSentAt?: Date;
  readAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};
