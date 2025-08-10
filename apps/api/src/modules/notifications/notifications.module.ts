import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsService } from '@/notifications/notifications.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationEntity, NotificationSchema } from '@/notifications/schemas/notification.schema';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [
    EventEmitterModule,
    MongooseModule.forFeature([
      { name: NotificationEntity.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})

export class NotificationsModule {}
