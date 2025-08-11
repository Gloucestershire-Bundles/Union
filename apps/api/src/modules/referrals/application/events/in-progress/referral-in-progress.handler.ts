import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ReferralInProgressEvent } from "./referral-in-progress.event";
import { Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NotificationsService } from "@/modules/notifications/notifications.service";

@EventsHandler(ReferralInProgressEvent)
export class ReferralInProgressEventHandler implements IEventHandler<ReferralInProgressEvent> {
  private readonly logger = new Logger(ReferralInProgressEventHandler.name);

  constructor(
    private readonly notificationService: NotificationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async handle(event: ReferralInProgressEvent): Promise<void> {
    this.logger.log(`[Event] Referral ${event.reference} has been moved to in progress.`)

    await this.notificationService.create({
      title: 'Referral In Progress',
      recipient: event.refereeId,
      description: `Referral ${event.reference} has been moved to in progress.`,
      link: `${process.env.PUBLIC_APP_URL}/referral/${event.reference}`,
    });

    this.eventEmitter.emit('referral.inprogress.audit', {
      reference: event.reference,
      timestamp: new Date(),
    });
  }
}