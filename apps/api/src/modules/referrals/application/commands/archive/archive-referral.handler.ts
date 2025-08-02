import { EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { ArchiveReferralCommand } from './archive-referral.command';
import { Inject, Logger } from '@nestjs/common';
import { IReferralRepository, REFERRAL_REPOSITORY } from '@/referrals/domain/referral.repository';

export class ArchiveReferralHandler implements ICommandHandler<ArchiveReferralCommand> {
  private readonly logger = new Logger(ArchiveReferralHandler.name);

  constructor(
    @Inject(REFERRAL_REPOSITORY)
    private readonly referralRepository: IReferralRepository,
    private readonly publisher: EventPublisher,
  ) {}
  
  execute(command: ArchiveReferralCommand): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
