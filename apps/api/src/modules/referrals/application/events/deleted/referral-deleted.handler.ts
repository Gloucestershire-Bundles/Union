import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ReferralDeletedEvent } from "./referral-deleted.event";
import { Logger } from "@nestjs/common";

@EventsHandler(ReferralDeletedEvent)
export class ReferralDeletedEventHandler implements IEventHandler<ReferralDeletedEvent> {
  private readonly logger = new Logger(ReferralDeletedEventHandler.name);

  handle(event: ReferralDeletedEvent) {
    this.logger.log('Deleted event fired.')
  }
}