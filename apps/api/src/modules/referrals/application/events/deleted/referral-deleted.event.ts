/**
 * @class ReferralDeletedEvent
 * @description Event fired when a referral is deleted.
 */
export class ReferralDeletedEvent {
  /**
   * @param reference The unique business reference of the created referral.
   */
  constructor(public readonly reference: string) {}
}
