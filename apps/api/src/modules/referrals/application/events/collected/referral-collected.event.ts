import { ReferralStatus } from "@/common/enums/referral-status.enum";
import { ReferralDetails } from "@/referrals/domain/models/interfaces/referral-details.interface";

/**
 * @class ReferralCollectedEvent
 * @description Event fired when a referral is moved to "Collected".
 */
export class ReferralCollectedEvent {
  /**
   * @param reference The unique business reference of the created referral.
   * @param refereeId The unique ID of the referee.
   * @param status The status of the referral.
   * @param details The details about the referral.
   */
  constructor(
    public readonly reference: string,
    public readonly refereeId: string,
    public readonly status: ReferralStatus,
    public readonly details: ReferralDetails,
  ) {}
}