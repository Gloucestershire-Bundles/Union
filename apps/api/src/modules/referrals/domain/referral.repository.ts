import { Referral } from '@/referrals/domain/referral.entity';

export const REFERRAL_REPOSITORY = 'REFERRAL_REPOSITORY';

/**
 * @interface IReferralRepository
 * @description Defines the contract for persistence operations on the Referral Aggregate.
 * This repository manages the state of the Referral entity.
 */
export interface IReferralRepository {
  /**
   * Loads a Referral aggregate by its unique business reference.
   * This is used by command handlers to retrieve the current state of an aggregate
   * for modifications.
   * @param reference The unique business reference of the referral to load.
   * @returns A Promise that resolves with the Referral aggregate if found, otherwise null.
   */
  findByReference(reference: string): Promise<Referral | null>;

  /**
   * Creates a Referral aggregate.
   * @param referral The Referral aggregate to save.
   * @returns A Promise that resolves when the operation is complete.
   */
  save(referral: Referral): Promise<void>;

  /**
   * Deletes a Referral record permanently from the persistence layer.
   * This is a hard delete and should be used with caution.
   * @param reference The unique business reference of the referral to delete.
   * @returns A Promise that resolves to true if the referral was found and deleted, false otherwise.
   */
  delete(reference: string): Promise<boolean>;
}
