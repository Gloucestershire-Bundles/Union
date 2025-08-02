import { ReferralStatus } from '@/common/enums/referral-status.enum';
import { ReferralDetails } from '@/referrals/domain/models/interfaces/referral-details.interface';

/**
 * @class ReferralCreatedEvent
 * @description Event fired when a new Referral aggregate is successfully created.
 * Contains all essential information about the newly created referral.
 */
export class ReferralCreatedEvent {
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
