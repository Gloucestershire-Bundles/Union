/**
 * @class ReferralAcceptedEvent
 * @description Event fired when a referral is moved to "Accepted".
 */
export class ReferralAcceptedEvent {
  /**
   * @param reference The unique business reference of the created referral.
   * @param refereeId The unique ID of the referrals referee.
   */
  constructor(
    public readonly reference: string,
    public readonly refereeId: string,
  ) {}
}
