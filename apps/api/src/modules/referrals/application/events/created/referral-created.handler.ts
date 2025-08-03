import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ReferralCreatedEvent } from "./referral-created.event";
import { Logger } from "@nestjs/common";

@EventsHandler(ReferralCreatedEvent)
export class ReferralCreatedEventHandler implements IEventHandler<ReferralCreatedEvent> {
  private readonly logger = new Logger(ReferralCreatedEventHandler.name);

  handle(event: ReferralCreatedEvent) {
    this.logger.log('Created event fired.')
  }
}