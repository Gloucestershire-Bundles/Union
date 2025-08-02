/**
 * @class ReferralRejectedEvent
 * @description Event fired when a referral is moved to "Rejected".
 */
export class ReferralRejectedEvent {
  /**
   * @param reference The unique business reference of the created referral.
   * @param reason The reason given for rejecting the referral.
   */
  constructor(
    public readonly reference: string,
    public readonly reason?: string,
  ) {}
}
