/**
 * @class ReferralInProgressEvent
 * @description Event fired when a referral is moved to "In Progress".
 */
export class ReferralInProgressEvent {
  /**
   * @param reference The unique business reference of the created referral.
   * @param refereeId The unique ID of the referee.
   */
  constructor(
    public readonly reference: string,
    public readonly refereeId: string,
  ) {}
}
