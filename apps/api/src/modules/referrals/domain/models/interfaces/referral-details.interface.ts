import { Child } from '@/referrals/domain/models/types/child.type';
import { Parent } from '@/referrals/domain/models/types/parent.type';

export interface ReferralDetails {
  parents: Array<Parent>;
  children: Array<Child>;
  postcode: string;
  reason: string;
  isRepeatFamily: boolean;
  file?: string;
}
