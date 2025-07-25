import { CommandHandler, EventPublisher, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ReferralDetails } from '@/referrals/domain/models/interfaces/referral-details.interface';
import { Inject, Logger } from '@nestjs/common';
import { IReferralRepository, REFERRAL_REPOSITORY } from '@/referrals/domain/referral.repository';
import { Referral } from '@/referrals/domain/referral.entity';

export class CreateReferralCommand implements ICommand {
  constructor(
    public readonly reference: string,
    public readonly refereeId: string,
    public readonly details: ReferralDetails,
  ) {}
}

@CommandHandler(CreateReferralCommand)
export class CreateReferralHandler implements ICommandHandler<CreateReferralCommand> {
  private readonly logger = new Logger(CreateReferralHandler.name);
  
  constructor(
    @Inject(REFERRAL_REPOSITORY)
    private readonly referralRepository: IReferralRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateReferralCommand): Promise<Referral> {
    const { reference, refereeId, details } = command;

    const referral = this.publisher.mergeObjectContext(
      Referral.create(reference, refereeId, details),
    );

    await this.referralRepository.create(referral);
    referral.commit();

    this.logger.log(`[CreateReferralCommand] Referral ${referral.reference} created.`);
    return referral;
  }
}