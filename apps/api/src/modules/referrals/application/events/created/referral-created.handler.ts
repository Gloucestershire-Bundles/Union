import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReferralCreatedEvent } from './referral-created.event';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationsService } from '@/notifications/notifications.service';
import { UsersService } from '@/modules/users/users.service';

@EventsHandler(ReferralCreatedEvent)
@Injectable()
export class ReferralCreatedEventHandler
  implements IEventHandler<ReferralCreatedEvent>
{
  private readonly logger = new Logger(ReferralCreatedEventHandler.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async handle(event: ReferralCreatedEvent): Promise<void> {
    this.logger.log('Created event fired.');

    const referee = await this.usersService.findOne(event.refereeId);

    await this.notificationsService.sendEmail(
      referee!.emailAddresses[0].emailAddress,
      `[${event.reference}] Thank you for submitting a Referral`,
      'createReferral',
      { 
        name: referee?.firstName, 
        referral: event
      },
    );
  }
}
