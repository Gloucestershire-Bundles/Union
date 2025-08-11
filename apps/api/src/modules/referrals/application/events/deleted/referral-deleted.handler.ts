import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ReferralDeletedEvent } from "./referral-deleted.event";
import { Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

@EventsHandler(ReferralDeletedEvent)
export class ReferralDeletedEventHandler implements IEventHandler<ReferralDeletedEvent> {
  private readonly logger = new Logger(ReferralDeletedEventHandler.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async handle(event: ReferralDeletedEvent): Promise<void> {
    this.logger.log(`[Event] Referral ${event.reference} has been deleted.`);

    this.eventEmitter.emit('referral.deleted.audit', {
      reference: event.reference,
      timestamp: new Date(),
    });
  }
}