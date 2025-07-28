import { Referral } from '@/referrals/domain/referral.entity';
import { IReferralReadModel } from './models/referral-read-model.interface';

export const REFERRAL_REPOSITORY = 'REFERRAL_REPOSITORY';
export const REFERRAL_READ_MODEL_REPOSITORY = 'REFERRAL_READ_MODEL_REPOSITORY';

/**
 * @interface IReferralRepository
 * @description Defines the contract for persistence operations on the Referral Aggregate.
 * This repository manages the state of the Referral entity.
 */
export interface IReferralRepository {
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

/**
 * @interface IReferralReadModelRepository
 * @description Defines the contract for read operations on the Referral Read Model.
 * This repository is optimized for querying and retrieving data for display.
 */
export interface IReferralReadModelRepository {
  /**
   * Finds a single referral read model by its unique business reference.
   * @param reference The unique business reference of the referral.
   * @returns A Promise that resolves with the IReferralReadModel if found, otherwise null.
   */
  findByReference(reference: string): Promise<IReferralReadModel | null>;

  /**
   * Finds all referral read models associated with a specific referee ID.
   * @param refereeId The ID of the referee.
   * @returns A Promise that resolves with an array of IReferralReadModel.
   * Returns an empty array if no referrals are found for the given referee.
   */
  findByRefereeId(refereeId: string): Promise<Array<IReferralReadModel>>;

  /**
   * Finds all referral read models in the system.
   * @returns A Promise that resolves with an array of all IReferralReadModel.
   * Returns an empty array if no referrals exist.
   */
  findAll(): Promise<Array<IReferralReadModel>>;
}
