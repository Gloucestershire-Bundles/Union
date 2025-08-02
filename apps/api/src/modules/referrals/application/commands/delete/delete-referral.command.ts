import { ICommand } from '@nestjs/cqrs';

/**
 * @class DeleteReferralCommand
 * @implements {ICommand}
 * @description Command to initiate the permanent deletion of a referral.
 * Uses the unique business reference to identify the referral.
 */
export class DeleteReferralCommand implements ICommand {
  constructor(public readonly reference: string) {}
}