import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ReferralArchivedEvent } from "./referral-archived.event";
import { Logger } from "@nestjs/common";

@EventsHandler(ReferralArchivedEvent)
export class ReferralArchivedEventHandler implements IEventHandler<ReferralArchivedEvent> {
  private readonly logger = new Logger(ReferralArchivedEventHandler.name);

  handle(event: ReferralArchivedEvent) {
    this.logger.log('Archived event fired.')
  }
}