import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ReferralRejectedEvent } from "./referral-rejected.event";
import { Logger } from "@nestjs/common";

@EventsHandler(ReferralRejectedEvent)
export class ReferralRejectedEventHandler implements IEventHandler<ReferralRejectedEvent> {
  private readonly logger = new Logger(ReferralRejectedEventHandler.name);

  handle(event: ReferralRejectedEvent) {
    this.logger.log('Rejected event fired.')
  }
}