import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReferralAcceptedEvent } from './referral-accepted.event';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationsService } from '@/notifications/notifications.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@EventsHandler(ReferralAcceptedEvent)
@Injectable()
export class ReferralAcceptedEventHandler
  implements IEventHandler<ReferralAcceptedEvent>
{
  private readonly logger = new Logger(ReferralAcceptedEventHandler.name);

  constructor(
    private readonly notificationService: NotificationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async handle(event: ReferralAcceptedEvent): Promise<void> {
    this.logger.log(`[Event] Referral ${event.reference} has been accepted.`);

    await this.notificationService.create({
      title: 'Referral Accepted',
      recipient: event.refereeId,
      description: `Referral ${event.reference} has been accepted.`,
      link: `${process.env.PUBLIC_APP_URL}/referral/${event.reference}`,
    });

    this.eventEmitter.emit('referral.accepted.audit', {
      reference: event.reference,
      timestamp: new Date(),
    });
  }
}
