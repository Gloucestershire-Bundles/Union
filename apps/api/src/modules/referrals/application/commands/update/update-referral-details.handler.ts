import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateReferralDetailsCommand } from './update-referral-details.command';
import { ConflictException, Inject, Logger } from '@nestjs/common';
import { ReferralNotFoundException } from '@/referrals/domain/referral.exception';
import { IReferralRepository, REFERRAL_REPOSITORY } from '@/referrals/domain/referral.repository';
import { ReferralDetails } from '@/referrals/domain/models/interfaces/referral-details.interface';

@CommandHandler(UpdateReferralDetailsCommand)
export class UpdateReferralHandler implements ICommandHandler<UpdateReferralDetailsCommand> {
  private readonly logger = new Logger(UpdateReferralHandler.name);

  constructor(
    @Inject(REFERRAL_REPOSITORY)
    private readonly referralRepository: IReferralRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateReferralDetailsCommand): Promise<void> {
    const { reference, newDetails } = command;

    this.logger.debug(`[${UpdateReferralHandler.name}] Attempting to update details for referral ${reference}.`);

    const referral = await this.referralRepository.findByReference(reference);
    if (!referral) {
      throw new ReferralNotFoundException(reference);
    }

    const mergedReferral = this.publisher.mergeObjectContext(referral);

    try {
      const domainDetails: ReferralDetails = newDetails;
      mergedReferral.updateDetails(domainDetails);
    } catch (error) {
      this.logger.warn(`[${UpdateReferralHandler.name}] Failed to update details for referral ${reference}: ${error.message}.`);
      throw new ConflictException(error.message);
    }
    
    await this.referralRepository.save(mergedReferral);
    mergedReferral.commit();

    this.logger.log(`[${UpdateReferralHandler.name}] Referral ${reference} details updated.`);
  }
}
