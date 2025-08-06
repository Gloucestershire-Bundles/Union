import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [CqrsModule, MongooseModule.forFeature([{}])],
  controllers: [NotificationsController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: NotificationDatabaseRepository,
    },
  ],
})
export class NotificationsModule {}
