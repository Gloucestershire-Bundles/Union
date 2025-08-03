import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ReferralWithdrawnEvent } from "./referral-withdrawn.event";
import { Logger } from "@nestjs/common";

@EventsHandler(ReferralWithdrawnEvent)
export class ReferralWithdrawnEventHandler implements IEventHandler<ReferralWithdrawnEvent> {
  private readonly logger = new Logger(ReferralWithdrawnEventHandler.name);

  handle(event: ReferralWithdrawnEvent) {
    this.logger.log('Withdrawn event fired.')
  }
}