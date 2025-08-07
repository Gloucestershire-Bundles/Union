import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@/auth/auth.module';
import { NotificationsService } from '@/notifications/notifications.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule,
    MongooseModule.forFeature([]),
  ],
  providers: [NotificationsService],
  exports: [NotificationsService],
})

export class NotificationsModule {}
