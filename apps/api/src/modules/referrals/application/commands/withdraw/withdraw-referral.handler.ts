import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { WithdrawReferralCommand } from './withdraw-referral.command';
import { Inject, Logger } from '@nestjs/common';
import {
  IReferralRepository,
  REFERRAL_REPOSITORY,
} from '@/referrals/domain/referral.repository';

@CommandHandler(WithdrawReferralCommand)
export class WithdrawReferralHandler
  implements ICommandHandler<WithdrawReferralCommand>
{
  private readonly logger = new Logger(WithdrawReferralHandler.name);

  constructor(
    @Inject(REFERRAL_REPOSITORY)
    private readonly referralRepository: IReferralRepository,
    private readonly publisher: EventPublisher,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  execute(_command: WithdrawReferralCommand): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
