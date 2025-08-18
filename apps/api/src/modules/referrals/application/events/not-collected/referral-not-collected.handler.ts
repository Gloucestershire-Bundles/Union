import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReferralNotCollectedEvent } from './referral-not-collected.event';
import { Logger } from '@nestjs/common';
import { NotificationsService } from '@/notifications/notifications.service';
import { UsersService } from '@/users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Role } from '@/common/enums/role.enum';

@EventsHandler(ReferralNotCollectedEvent)
export class ReferralNotCollectedEventHandler
  implements IEventHandler<ReferralNotCollectedEvent>
{
  private readonly logger = new Logger(ReferralNotCollectedEventHandler.name);

  constructor(
    private readonly userService: UsersService,
    private readonly notificationService: NotificationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async handle(event: ReferralNotCollectedEvent): Promise<void> {
    this.logger.log(
      `[Event] Referral ${event.reference} has moved to Not Collected.`,
    );

    const referee = await this.userService.findOne(event.refereeId);

    if (referee) {
      await this.notificationService.sendEmail(
        referee.emailAddresses[0].emailAddress,
        `[${event.reference}] ALERT: You have not collected your Referral`,
        'referralNotCollected',
        {
          name: referee.firstName || undefined,
          referral: {
            reference: event.reference,
            status: event.status,
          },
        },
      );
    }

    await this.notificationService.create({
      title: 'Referral Not Collected',
      recipient: event.refereeId,
      description: `Referral ${event.reference} has not been collected.`,
      link: `${process.env.PUBLIC_APP_URL}/referral/${event.reference}`,
    });

    const volunteers = await this.userService.findAllByRole(Role.VOLUNTEER);

    const volunteerNotification = {
      title: 'Referral Not Collected',
      description: `Referral ${event.reference} has not been collected.`,
      link: `${process.env.PRIVATE_APP_URL}/referral/${event.reference}`,
    };

    const createVolunteerNotifications = volunteers.map((volunteer) => ({
      ...volunteerNotification,
      recipient: volunteer.id,
    }));

    await this.notificationService.createMany(createVolunteerNotifications);

    this.eventEmitter.emit('referral.notcollected.audit', {
      reference: event.reference,
      timestamp: new Date(),
    });
  }
}
