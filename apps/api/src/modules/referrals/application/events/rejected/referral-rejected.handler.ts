import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ReferralRejectedEvent } from "./referral-rejected.event";
import { Logger } from "@nestjs/common";
import { NotificationsService } from "@/modules/notifications/notifications.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UsersService } from "@/modules/users/users.service";

@EventsHandler(ReferralRejectedEvent)
export class ReferralRejectedEventHandler implements IEventHandler<ReferralRejectedEvent> {
  private readonly logger = new Logger(ReferralRejectedEventHandler.name);

  constructor(
    private readonly userService: UsersService,
    private readonly notificationService: NotificationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async handle(event: ReferralRejectedEvent): Promise<void> {
    this.logger.log(`[Event] Referral ${event.reference} has been rejected.`);

    const referee = await this.userService.findOne(event.refereeId);

    if (referee) {
      await this.notificationService.sendEmail(
        referee.emailAddresses[0].emailAddress,
        `[${event.reference}] ALERT: Your Referral has been rejected`,
        'referralCreated',
        {
          name: referee.firstName || undefined,
          referral: {
            reference: event.reference,
            status: event.status,
          },
        },
      )
    }

    await this.notificationService.create({
      title: 'Referral Rejected',
      recipient: event.refereeId,
      description: `Referral ${event.reference} has been rejected.`,
      link: `${process.env.PUBLIC_APP_URL}/referral/${event.reference}`,
    });

    this.eventEmitter.emit('referral.rejected.audit', {
      reference: event.reference,
      timestamp: new Date(),
      reason: event.rejectedReason,
    });
  }
}