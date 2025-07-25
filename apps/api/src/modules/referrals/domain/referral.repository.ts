import { Referral } from '@/referrals/domain/referral.entity';

export const REFERRAL_REPOSITORY = 'REFERRAL_REPOSITORY';

export interface IReferralRepository {
  create(referral: Referral): Promise<void>;
  // findAll(): Promise<Array<Referral>>;
  // findAllByReferee(refereeId: string): Promise<Array<Referral>>;
  // findOne(id: string): Promise<Referral | null>;
  // findOneByReference(reference: string): Promise<Referral | null>;
  // update(id: string): Promise<Referral | null>;
  // delete(id: string): Promise<boolean>;
  // withdraw(id: string): Promise<Referral | null>;
  // archive(id: string): Promise<Referral | null>;
}
