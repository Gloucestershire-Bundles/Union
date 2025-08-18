import { ICommand } from '@nestjs/cqrs';

/**
 * @class WithdrawReferralCommand
 * @implements {ICommand}
 * @description Command to initiate the withdrawal of a referral.
 * Contains all necessary data to withdraw a referral.
 */
export class WithdrawReferralCommand implements ICommand {
  /**
   * @param reference The unique ID of the referral to withdraw.
   * @param reason The reason for withdrawing a referral.
   */
  constructor(
    public readonly reference: string,
    public readonly reason?: string,
  ) {}
}
