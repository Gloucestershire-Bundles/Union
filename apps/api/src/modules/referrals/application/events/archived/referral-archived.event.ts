/**
 * @class ReferralArchivedEvent
 * @description Event fired when a referral is moved to "Archived".
 */
export class ReferralArchivedEvent {
  /**
   * @param reference The unique business reference of the created referral.
   * @param reason The reason given for archiving the referral.
   * @param archivedAt The timestamp to which the referral is archived.
   */
  constructor(
    public readonly reference: string,
    public readonly archivedReason?: string,
    public readonly archivedAt?: Date,
  ) {}
}
