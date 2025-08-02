import { ReferralDetails } from '@/referrals/domain/models/interfaces/referral-details.interface';
import { ICommand } from '@nestjs/cqrs';

/**
 * @class UpdateReferralCommand
 * @implements {ICommand}
 * @description Command to initiate the update of a new referral.
 * Contains all necessary data to update a Referral Aggregate.
 */
export class UpdateReferralDetailsCommand implements ICommand {
  /**
   * @param reference The unique ID for the referral.
   * @param newDetails The updated information for the referral.
   */
  constructor(
    public readonly reference: string,
    public readonly newDetails: ReferralDetails,
  ) {}
}
