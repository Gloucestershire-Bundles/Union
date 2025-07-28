import { ReferralStatus } from '@/common/enums/referral-status.enum';
import { ReferralDetails } from '@/referrals/domain/models/interfaces/referral-details.interface';

export interface IReferralReadModel {
  reference: string;
  refereeId: string;
  details: ReferralDetails;
  status: ReferralStatus;
  withdrawnAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
