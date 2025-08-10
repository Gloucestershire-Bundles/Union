import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ReferralReadyEvent } from "./referral-ready.event";
import { Logger } from "@nestjs/common";

@EventsHandler(ReferralReadyEvent)
export class ReferralReadyEventHandler implements IEventHandler<ReferralReadyEvent> {
  private readonly logger = new Logger(ReferralReadyEventHandler.name);

  handle(event: ReferralReadyEvent) {
    this.logger.log('Ready event fired.')

    // TODO: Create notification in submission dashboard
    // TODO: Propose an ability to book a collection
    // TODO: Audit module
  }
}