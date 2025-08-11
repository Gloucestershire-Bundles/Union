import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReferralCreatedEvent } from './referral-created.event';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationsService } from '@/notifications/notifications.service';
import { UsersService } from '@/users/users.service';
import { Role } from '@/common/enums/role.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';

@EventsHandler(ReferralCreatedEvent)
@Injectable()
export class ReferralCreatedEventHandler implements IEventHandler<ReferralCreatedEvent> {
  private readonly logger = new Logger(ReferralCreatedEventHandler.name);

  constructor(
    private readonly userService: UsersService,
    private readonly notificationService: NotificationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async handle(event: ReferralCreatedEvent): Promise<void> {
    this.logger.log(`[Event] Referral ${event.reference} has been created.`);

    const referee = await this. userService.findOne(event.refereeId);

    if (referee) {
      await this.notificationService.sendEmail(
        referee.emailAddresses[0].emailAddress,
        `[${event.reference}] Thank you for submitting a Referral`,
        'referralCreated',
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
      title: 'Referral Submitted',
      recipient: event.refereeId,
      description: `A new Referral ${event.reference} has been created.`,
      link: `${process.env.PUBLIC_APP_URL}/referral/${event.reference}`,
    });

    const volunteers = await this.userService.findAllByRole(Role.VOLUNTEER);

    const volunteerNotification = {
      title: 'Referral Submitted',
      description: `A new Referral ${event.reference} has been created.`,
      link: `${process.env.PRIVATE_APP_URL}/referral/${event.reference}`,
    };

    const createVolunteerNotifications = volunteers.map((volunteer) => ({
      ...volunteerNotification,
      recipient: volunteer.id,
    }));

    await this.notificationService.createMany(createVolunteerNotifications);

    this.eventEmitter.emit('referral.created.audit', {
      reference: event.reference,
      timestamp: new Date(),
    });
  }
}
