import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ReferralUpdatedEvent } from "./referral-updated.event";
import { Logger } from "@nestjs/common";

@EventsHandler(ReferralUpdatedEvent)
export class ReferralUpdatedEventHandler implements IEventHandler<ReferralUpdatedEvent> {
  private readonly logger = new Logger(ReferralUpdatedEventHandler.name);

  handle(event: ReferralUpdatedEvent) {
    this.logger.log('Updated event fired.')
  }
}