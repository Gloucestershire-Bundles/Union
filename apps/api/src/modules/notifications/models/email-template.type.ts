import { ReferralStatus } from '@/common/enums/referral-status.enum';
import { ReferralDetails } from '@/referrals/domain/models/interfaces/referral-details.interface';

type ReferralEmailData = {
  reference: string;
  status: ReferralStatus;
  details?: ReferralDetails;
};

export type EmailTemplateData = {
  name?: string;
  referral?: ReferralEmailData;
};
