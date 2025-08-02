/**
 * @class ReferralWithdrawnEvent
 * @description Event fired when a referral is moved to "Withdrawn".
 */
export class ReferralWithdrawnEvent {
  /**
   * @param reference The unique business reference of the created referral.
   * @param reason The reason given for withdrawing the referral.
   * @param withdrawnAt The timestamp to which the referral is withdrawn.
   */
  constructor(
    public readonly reference: string,
    public readonly reason?: string,
    public readonly withdrawnAt?: Date,
  ) {}
}
