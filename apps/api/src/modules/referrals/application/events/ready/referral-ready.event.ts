/**
 * @class ReferralReadyEvent
 * @description Event fired when a referral is moved to "Ready".
 */
export class ReferralReadyEvent {
  /**
   * @param reference The unique business reference of the created referral.
   */
  constructor(public readonly reference: string) {}
}