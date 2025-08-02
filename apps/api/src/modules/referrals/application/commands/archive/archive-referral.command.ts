import { ICommand } from '@nestjs/cqrs';

/**
 * @class ArchiveReferralCommand
 * @implements {ICommand}
 * @description Command to initiate the archive of a referral.
 * Contains all necessary data to archive a referral.
 */
export class ArchiveReferralCommand implements ICommand {
  /**
   * @param reference The unique ID of the referral to archive.
   * @param reason The reason for archiving a referral.
   */
  constructor(
    public readonly reference: string,
    public readonly reason?: string,
  ) {}
}
