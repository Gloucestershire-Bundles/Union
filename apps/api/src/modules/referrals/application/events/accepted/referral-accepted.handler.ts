import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReferralAcceptedEvent } from './referral-accepted.event';
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { NotificationsService } from '@/notifications/notifications.service';

@EventsHandler(ReferralAcceptedEvent)
@Injectable()
export class ReferralAcceptedEventHandler
  implements IEventHandler<ReferralAcceptedEvent>
{
  private readonly logger = new Logger(ReferralAcceptedEventHandler.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async handle(event: ReferralAcceptedEvent): Promise<void> {
    this.logger.log('Accepted event fired.');

    const referee = await this.usersService.findOne(event.refereeId);

    if (!referee) {
      this.logger.error(`Referee with ID "${event.refereeId}" not found.`);
      return;
    }

    await this.notificationsService.create({
      title: 'Referral Accepted',
      recipient: event.refereeId,
      description: `Referral ${event.reference} has been accepted.`,
      link: `${process.env.PUBLIC_APP_URL}/referral/${event.reference}`,
    });

    // TODO: Audit Module
  }
}
