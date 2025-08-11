import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReferralCollectedEvent } from './referral-collected.event';
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { NotificationsService } from '@/notifications/notifications.service';
import { Role } from '@/common/enums/role.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';

@EventsHandler(ReferralCollectedEvent)
@Injectable()
export class ReferralCollectedEventHandler implements IEventHandler<ReferralCollectedEvent> {
  private readonly logger = new Logger(ReferralCollectedEventHandler.name);

  constructor(
    private readonly userService: UsersService,
    private readonly notificationService: NotificationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async handle(event: ReferralCollectedEvent): Promise<void> {
    this.logger.log(`[Event] Referral ${event.reference} has been collected.`);

    const referee = await this.userService.findOne(event.refereeId);

    if (referee) {
      await this.notificationService.sendEmail(
        referee.emailAddresses[0].emailAddress,
        `[${event.reference}] Thank you for collecting your Referral`,
        'referralCollected',
        {
          name: referee.firstName || undefined,
          referral: {
            reference: event.reference,
            status: event.status,
            details: event.details,
          },
        },
      ); 
    }

    await this.notificationService.create({
      title: 'Referral Collected',
      recipient: event.refereeId,
      description: `Referral ${event.reference} has been collected.`,
      link: `${process.env.PUBLIC_APP_URL}/referral/${event.reference}`,
    });

    const volunteers = await this.userService.findAllByRole(Role.VOLUNTEER);

    const volunteerNotification = {
      title: 'Referral Collected',
      description: `Referral ${event.reference} has been collected.`,
      link: `${process.env.PRIVATE_APP_URL}/referral/${event.reference}`,
    };

    const createVolunteerNotifications = volunteers.map((volunteer) => ({
      ...volunteerNotification,
      recipient: volunteer.id,
    }));

    await this.notificationService.createMany(createVolunteerNotifications);

    this.eventEmitter.emit('referral.collected.audit', {
      reference: event.reference,
      timestamp: new Date(),
    });
  }
}
