import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateReferralStatusCommand } from './update-referral-status.command';
import { BadRequestException, ConflictException, Inject, Logger } from '@nestjs/common';
import {
  IReferralRepository,
  REFERRAL_REPOSITORY,
} from '@/referrals/domain/referral.repository';
import { ReferralNotFoundException } from '@/referrals/domain/referral.exception';

@CommandHandler(UpdateReferralStatusCommand)
export class UpdateReferralStatusHandler implements ICommandHandler<UpdateReferralStatusCommand> {
  private readonly logger = new Logger(UpdateReferralStatusHandler.name);

  constructor(
    @Inject(REFERRAL_REPOSITORY)
    private readonly referralRepository: IReferralRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateReferralStatusCommand): Promise<void> {
    const { reference, newStatus, reason } = command;

    this.logger.debug(`[${UpdateReferralStatusHandler.name}] Attempting to update referral ${reference} to status: ${newStatus}.`);

    const referral = await this.referralRepository.findByReference(reference);
    if (!referral) {
      throw new ReferralNotFoundException(reference);
    }

    const oldStatus = referral.status;
    const mergedReferral = this.publisher.mergeObjectContext(referral);

    try {
      mergedReferral.updateStatus(newStatus, reason);
    } catch (error) {
      this.logger.warn(`[${UpdateReferralStatusHandler.name}] Invalid status transition for referral ${reference}: ${error.message}.`);
      throw new BadRequestException(error.message);
    }

    await this.referralRepository.save(mergedReferral);
    mergedReferral.commit();

    this.logger.log(`[${UpdateReferralStatusHandler.name}] Referral ${reference} status updated from ${oldStatus} to ${newStatus}.`);
  }
}
