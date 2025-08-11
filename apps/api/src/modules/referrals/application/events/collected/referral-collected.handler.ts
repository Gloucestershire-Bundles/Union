import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ReferralCollectedEvent } from "./referral-collected.event";
import { Logger } from "@nestjs/common";

@EventsHandler(ReferralCollectedEvent)
export class ReferralCollectedEventHandler implements IEventHandler<ReferralCollectedEvent> {
  private readonly logger = new Logger(ReferralCollectedEventHandler.name);

  async handle(event: ReferralCollectedEvent): Promise<void> {
    this.logger.log('Collected event fired.');

    // TODO: Email with an attachment of the PDF.
    // TODO: Audit Module 
    // TODO: Create notification in submission dashboard
  }
}