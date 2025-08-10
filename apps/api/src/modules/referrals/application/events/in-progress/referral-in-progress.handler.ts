import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ReferralInProgressEvent } from "./referral-in-progress.event";
import { Logger } from "@nestjs/common";

@EventsHandler(ReferralInProgressEvent)
export class ReferralInProgressEventHandler implements IEventHandler<ReferralInProgressEvent> {
  private readonly logger = new Logger(ReferralInProgressEventHandler.name);

  handle(event: ReferralInProgressEvent) {
    this.logger.log('InProgress event fired.')

    // TODO: Create notification in submission dashboard
    // TODO: Audit module
  }
}