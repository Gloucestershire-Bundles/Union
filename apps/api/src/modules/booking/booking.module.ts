import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { UsersModule } from '@/users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';

const CommandHandlers = [];
const QueryHandlers = [];
const EventHandlers = [];

@Module({
  imports: [
    UsersModule,
    NotificationsModule,
    CqrsModule,
    EventEmitterModule,
    MongooseModule.forFeature([]),
  ],
  controllers: [BookingController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
})

export class BookingModule {}
