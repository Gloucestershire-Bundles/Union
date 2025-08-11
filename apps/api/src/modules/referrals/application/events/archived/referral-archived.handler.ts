import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReferralArchivedEvent } from './referral-archived.event';
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { NotificationsService } from '@/notifications/notifications.service';
import { Role } from '@/common/enums/role.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';

@EventsHandler(ReferralArchivedEvent)
@Injectable()
export class ReferralArchivedEventHandler implements IEventHandler<ReferralArchivedEvent> {
  private readonly logger = new Logger(ReferralArchivedEventHandler.name);

  constructor(
    private readonly userService: UsersService,
    private readonly notificationService: NotificationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async handle(event: ReferralArchivedEvent): Promise<void> {
    this.logger.log(`[Event] Referral ${event.reference} has been archived.`);

    const volunteers = await this.userService.findAllByRole(Role.VOLUNTEER);

    const volunteerNotification = {
      title: 'Referral Archived',
      description: `Referral ${event.reference} has been archived.`,
      link: `${process.env.PRIVATE_APP_URL}/referral/archived/${event.reference}`,
    };

    const createVolunteerNotifications = volunteers.map((volunteer) => ({
      ...volunteerNotification,
      recipient: volunteer.id,
    }));

    await this.notificationService.createMany(createVolunteerNotifications);

    this.eventEmitter.emit('referral.archived.audit', {
      reference: event.reference,
      timestamp: event.archivedAt,
      reason: event.archivedReason,
    });
  }
}
