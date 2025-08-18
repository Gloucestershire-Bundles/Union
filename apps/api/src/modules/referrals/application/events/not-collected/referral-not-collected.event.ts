import { ReferralStatus } from '@/common/enums/referral-status.enum';
import { ReferralDetails } from '@/referrals/domain/models/interfaces/referral-details.interface';

/**
 * @class ReferralNotCollectedEvent
 * @description Event fired when a referral is moved to "Not Collected".
 */
export class ReferralNotCollectedEvent {
  /**
   * @param reference The unique business reference of the created referral.
   * @param refereeId The ID of the referee associated with the referral.
   * @param details The detailed information about the referral.
   * @param status The initial status of the referral.
   */
  constructor(
    public readonly reference: string,
    public readonly refereeId: string,
    public readonly details: ReferralDetails,
    public readonly status: ReferralStatus,
  ) {}
}
