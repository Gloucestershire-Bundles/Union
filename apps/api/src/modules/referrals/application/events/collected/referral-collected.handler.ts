import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ReferralCollectedEvent } from "./referral-collected.event";
import { Logger } from "@nestjs/common";

@EventsHandler(ReferralCollectedEvent)
export class ReferralCollectedEventHandler implements IEventHandler<ReferralCollectedEvent> {
  private readonly logger = new Logger(ReferralCollectedEventHandler.name);

  handle(event: ReferralCollectedEvent) {
    this.logger.log('Collected event fired.')
  }
}