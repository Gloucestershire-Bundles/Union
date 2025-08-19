import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ReferralsModule } from '@/referrals/referrals.module';
import { DatabaseModule } from '@/common/database/database.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from '@/auth/auth.module';
import { ClerkAuthGuard } from '@/auth/guards/clerk-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { CommentsModule } from '@/comments/comments.module';
import { NotificationsModule } from '@/notifications/notifications.module';
import { UsersModule } from '@/users/users.module';
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
import { ErrorHandlingInterceptor } from '@/common/interceptors/error-handling.interceptor';
import { BookingModule } from './modules/booking/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CqrsModule.forRoot(),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      global: true,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ReferralsModule,
    CommentsModule,
    NotificationsModule,
    BookingModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorHandlingInterceptor,
    },
  ],
})
export class AppModule {}
