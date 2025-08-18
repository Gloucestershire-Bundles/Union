import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReferralUpdatedEvent } from './referral-updated.event';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationsService } from '@/notifications/notifications.service';
import { UsersService } from '@/users/users.service';
import { Role } from '@/common/enums/role.enum';

@EventsHandler(ReferralUpdatedEvent)
export class ReferralUpdatedEventHandler
  implements IEventHandler<ReferralUpdatedEvent>
{
  private readonly logger = new Logger(ReferralUpdatedEventHandler.name);

  constructor(
    private readonly userService: UsersService,
    private readonly notificationService: NotificationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async handle(event: ReferralUpdatedEvent): Promise<void> {
    this.logger.log(`[Event] Referral ${event.reference} has been updated.`);

    const volunteers = await this.userService.findAllByRole(Role.VOLUNTEER);

    const volunteerNotification = {
      title: 'Referral Updated',
      description: `A new Referral ${event.reference} has been updated.`,
      link: `${process.env.PRIVATE_APP_URL}/referral/${event.reference}`,
    };

    const createVolunteerNotifications = volunteers.map((volunteer) => ({
      ...volunteerNotification,
      recipient: volunteer.id,
    }));

    await this.notificationService.createMany(createVolunteerNotifications);

    this.eventEmitter.emit('referral.rejected.audit', {
      reference: event.reference,
      timestamp: new Date(),
    });
  }
}
