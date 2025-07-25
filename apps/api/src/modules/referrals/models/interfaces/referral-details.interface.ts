import { Child } from '@/referrals/models/types/child.type';
import { Parent } from '@/referrals/models/types/parent.type';

export interface ReferralDetails {
  parents: Array<Parent>;
  children: Array<Child>;
  postcode: string;
  reason: string;
  isRepeatFamily: boolean;
  file?: string;
}
