import { ReferralStatus } from "@/common/enums/referral-status.enum";

/**
 * @class ReferralReadyEvent
 * @description Event fired when a referral is moved to "Ready".
 */
export class ReferralReadyEvent {
  /**
   * @param reference The unique business reference of the created referral.
   * @param refereeId The unique ID of the referee.
   * @param status The status of the referral.
   */
  constructor(
    public readonly reference: string,
    public readonly refereeId: string,
    public readonly status: ReferralStatus,
  ) {}
}