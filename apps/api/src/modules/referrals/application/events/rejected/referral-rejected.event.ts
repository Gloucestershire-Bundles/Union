import { ReferralStatus } from "@/common/enums/referral-status.enum";

/**
 * @class ReferralRejectedEvent
 * @description Event fired when a referral is moved to "Rejected".
 */
export class ReferralRejectedEvent {
  /**
   * @param reference The unique business reference of the created referral.
   * @param rejectedReason The reason given for rejecting the referral.
   * @param status The new status of the referral.
   * @param refereeId The unique ID of the referee.
   */
  constructor(
    public readonly reference: string,
    public readonly refereeId: string,
    public readonly status: ReferralStatus,
    public readonly rejectedReason?: string,
  ) {}
}
