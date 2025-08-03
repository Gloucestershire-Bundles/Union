import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ReferralAcceptedEvent } from "./referral-accepted.event";
import { Logger } from "@nestjs/common";

@EventsHandler(ReferralAcceptedEvent)
export class ReferralAcceptedEventHandler implements IEventHandler<ReferralAcceptedEvent> {
  private readonly logger = new Logger(ReferralAcceptedEventHandler.name);

  handle(event: ReferralAcceptedEvent) {
    this.logger.log('Accepted event fired.')
  }
}