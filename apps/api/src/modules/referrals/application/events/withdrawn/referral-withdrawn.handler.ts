import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReferralWithdrawnEvent } from './referral-withdrawn.event';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UsersService } from '@/modules/users/users.service';
import { NotificationsService } from '@/modules/notifications/notifications.service';
import { Role } from '@/common/enums/role.enum';

@EventsHandler(ReferralWithdrawnEvent)
export class ReferralWithdrawnEventHandler
  implements IEventHandler<ReferralWithdrawnEvent>
{
  private readonly logger = new Logger(ReferralWithdrawnEventHandler.name);

  constructor(
    private readonly userService: UsersService,
    private readonly notificationService: NotificationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async handle(event: ReferralWithdrawnEvent) {
    this.logger.log(`[Event] Referral ${event.reference} has been withdrawn.`);

    await this.notificationService.create({
      title: 'Referral Withdrawn',
      recipient: event.refereeId,
      description: `Referral ${event.reference} has been withdrawn.`,
      link: `${process.env.PUBLIC_APP_URL}/referral/withdrawn/${event.reference}`,
    });

    const volunteers = await this.userService.findAllByRole(Role.VOLUNTEER);

    const volunteerNotification = {
      title: 'Referral Withdrawn',
      description: `Referral ${event.reference} has been withdrawn.`,
      link: `${process.env.PRIVATE_APP_URL}/referral/withdrawn/${event.reference}`,
    };

    const createVolunteerNotifications = volunteers.map((volunteer) => ({
      ...volunteerNotification,
      recipient: volunteer.id,
    }));

    await this.notificationService.createMany(createVolunteerNotifications);

    this.eventEmitter.emit('referral.rejected.audit', {
      reference: event.reference,
      timestamp: new Date(),
      reason: event.withdrawnReason,
    });
  }
}
