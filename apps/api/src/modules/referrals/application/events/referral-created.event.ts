import { ReferralStatus } from '@/common/enums/referral-status.enum';
import { ReferralDetails } from '@/referrals/models/interfaces/referral-details.interface';

export class ReferralCreatedEvent {
  constructor(
    public readonly reference: string,
    public readonly refereeId: string,
    public readonly details: ReferralDetails,
    public readonly status: ReferralStatus,
  ) {}
}
