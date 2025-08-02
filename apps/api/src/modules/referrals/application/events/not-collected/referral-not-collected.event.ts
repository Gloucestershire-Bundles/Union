/**
 * @class ReferralNotCollectedEvent
 * @description Event fired when a referral is moved to "Not Collected".
 */
export class ReferralNotCollectedEvent {
  /**
   * @param reference The unique business reference of the created referral.
   * @param reason The reason given for not collecting the referral.
   */
  constructor(
    public readonly reference: string,
    public readonly reason?: string,
  ) {}
}
