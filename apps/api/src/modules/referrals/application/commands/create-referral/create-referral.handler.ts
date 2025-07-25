import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateReferralCommand } from '@/referrals/application/commands/create-referral/create-referral.command';
import { Inject, Logger } from '@nestjs/common';
import {
  IReferralRepository,
  REFERRAL_REPOSITORY,
} from '@/referrals/domain/referral.repository';
import { Referral } from '@/referrals/domain/referral.entity';

@CommandHandler(CreateReferralCommand)
export class CreateReferralHandler
  implements ICommandHandler<CreateReferralCommand> {
  
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
