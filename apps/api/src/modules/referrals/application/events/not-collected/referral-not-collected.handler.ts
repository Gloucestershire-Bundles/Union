import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ReferralNotCollectedEvent } from "./referral-not-collected.event";
import { Logger } from "@nestjs/common";

@EventsHandler(ReferralNotCollectedEvent)
export class ReferralNotCollectedEventHandler implements IEventHandler<ReferralNotCollectedEvent> {
  private readonly logger = new Logger(ReferralNotCollectedEventHandler.name);

  handle(event: ReferralNotCollectedEvent) {
    this.logger.log('NotCollected event fired.')

    // TODO: Create notification in submission dashboard
    // TODO: Create notification in management dashboard
    // TODO: Audit module
    // TODO: Re-book collection appointment
  }
}