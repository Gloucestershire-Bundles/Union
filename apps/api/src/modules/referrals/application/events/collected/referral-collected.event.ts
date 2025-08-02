/**
 * @class ReferralCollectedEvent
 * @description Event fired when a referral is moved to "Collected".
 */
export class ReferralCollectedEvent {
  /**
   * @param reference The unique business reference of the created referral.
   */
  constructor(public readonly reference: string) {}
}