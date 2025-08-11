import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReferralArchivedEvent } from './referral-archived.event';
import { Logger } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { NotificationsService } from '@/notifications/notifications.service';
import { Role } from '@/common/enums/role.enum';

@EventsHandler(ReferralArchivedEvent)
export class ReferralArchivedEventHandler
  implements IEventHandler<ReferralArchivedEvent>
{
  private readonly logger = new Logger(ReferralArchivedEventHandler.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async handle(event: ReferralArchivedEvent): Promise<void> {
    this.logger.log('Archived event fired.');

    const volunteers = await this.usersService.findAllByRole(Role.VOLUNTEER);

    const volunteerNotification = {
      title: 'Referral Archived',
      description: `Referral ${event.reference} has been archived.`,
      link: `${process.env.PRIVATE_APP_URL}/referral/archived/${event.reference}`,
    };

    const createVolunteerNotifications = volunteers.map((volunteer) => ({
      ...volunteerNotification,
      recipient: volunteer.id,
    }));

    await this.notificationsService.createMany(createVolunteerNotifications);

    // TODO: Audit Module
  }
}
