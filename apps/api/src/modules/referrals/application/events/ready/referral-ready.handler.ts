import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReferralReadyEvent } from './referral-ready.event';
import { Logger } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { NotificationsService } from '@/notifications/notifications.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@EventsHandler(ReferralReadyEvent)
export class ReferralReadyEventHandler
  implements IEventHandler<ReferralReadyEvent>
{
  private readonly logger = new Logger(ReferralReadyEventHandler.name);

  constructor(
    private readonly userService: UsersService,
    private readonly notificationService: NotificationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async handle(event: ReferralReadyEvent): Promise<void> {
    this.logger.log(
      `[Event] Referral ${event.reference} has been moved to Ready.`,
    );

    const referee = await this.userService.findOne(event.refereeId);

    if (referee) {
      await this.notificationService.sendEmail(
        referee.emailAddresses[0].emailAddress,
        `[${event.reference}] Your Referral is ready to collect`,
        'referralReady',
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
      title: 'Referral Ready',
      recipient: event.refereeId,
      description: `Referral ${event.reference} is ready to be collected.`,
      link: `${process.env.PUBLIC_APP_URL}/referral/${event.reference}`,
    });

    this.eventEmitter.emit('referral.ready.audit', {
      reference: event.reference,
      timestamp: new Date(),
    });

    // TODO: Propose an ability to book a collection
  }
}
