import { ReferralStatus } from '@/common/enums/referral-status.enum';
import { ReferralDetails } from '@/referrals/domain/models/interfaces/referral-details.interface';

export class ReferralUpdatedEvent {
  /**
   * @param reference The unique business reference of the referral.
   * @param newStatus Optional: The new status for the referral.
   * @param newDetails Optional: The new details for the referral.
   * @param reason Optional: The reason for changing the referral status.
   */
  constructor(
    public readonly reference: string,
    public readonly newStatus?: ReferralStatus,
    public readonly newDetails?: ReferralDetails,
    public readonly reason?: string,
  ) {}
}
