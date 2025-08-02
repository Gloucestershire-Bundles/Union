import { ICommand } from '@nestjs/cqrs';
import { ReferralDetails } from '@/referrals/domain/models/interfaces/referral-details.interface';

/**
 * @class CreateReferralCommand
 * @implements {ICommand}
 * @description Command to initiate the creation of a new referral.
 * Contains all necessary data to construct a Referral Aggregate Root.
 */
export class CreateReferralCommand implements ICommand {
  /**
   * @param reference The unique ID for the new referral, typically generated before the command.
   * @param refereeId The ID of the referee creating the referral.
   * @param details The detailed information for the referral.
   */
  constructor(
    public readonly reference: string,
    public readonly refereeId: string,
    public readonly details: ReferralDetails,
  ) {}
}
