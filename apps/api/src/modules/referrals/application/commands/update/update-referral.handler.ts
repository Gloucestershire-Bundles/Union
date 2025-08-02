import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateReferralCommand } from './update-referral.command';
import { ConflictException, Inject, Logger } from '@nestjs/common';
import { ReferralNotFoundException } from '@/referrals/domain/referral.exception';
import { IReferralRepository, REFERRAL_REPOSITORY } from '@/referrals/domain/referral.repository';

@CommandHandler(UpdateReferralCommand)
export class UpdateReferralHandler
  implements ICommandHandler<UpdateReferralCommand>
{
  private readonly logger = new Logger(UpdateReferralHandler.name);

  constructor(
    @Inject(REFERRAL_REPOSITORY)
    private readonly referralRepository: IReferralRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateReferralCommand): Promise<void> {
    const { reference, newStatus, newDetails, reason } = command;

    this.logger.debug(`[${UpdateReferralHandler.name}] Attempting to update referral ${reference} to status: ${newStatus}.`,);

    const referral = await this.referralRepository.findByReference(reference);
    if (!referral) {
      throw new ReferralNotFoundException(reference);
    }

    const oldStatus = referral.status;
    const mergedReferral = this.publisher.mergeObjectContext(referral);

    try {
      mergedReferral.updateStatus(newStatus, reason);
    } catch (error) {
      this.logger.warn(`[${UpdateReferralHandler.name}] Invalid status transition for referral ${reference}: ${error.message}.`);
      throw new ConflictException(error.message);
    }
    
    await this.referralRepository.save(mergedReferral);
    mergedReferral.commit();

    this.logger.log(`[${UpdateReferralHandler.name}] Referral ${reference} status updated from ${oldStatus} to ${newStatus}.`);
  }
}
