import { Injectable, Logger } from '@nestjs/common';
import { IReferralRepository } from '@/referrals/domain/referral.repository';
import { InjectModel } from '@nestjs/mongoose';
import {
  ReferralDocument,
  ReferralEntity,
} from '@/referrals/infrastructure/referral.schema';
import { Model } from 'mongoose';
import { Referral } from '@/referrals/domain/referral.entity';
import { IReferralReadModel } from '@/referrals/domain/read-model/referral-read-model.interface';
import { ReferralMapper } from '@/referrals/application/referral.mapper';
import { IReferralReadModelRepository } from '@/referrals/domain/read-model/referral-read-model.repository';

@Injectable()
export class ReferralDatabaseRepository implements IReferralRepository {
  private readonly logger = new Logger(ReferralDatabaseRepository.name);

  constructor(
    @InjectModel(ReferralEntity.name)
    private referralModel: Model<ReferralDocument>,
    private readonly referralMapper: ReferralMapper,
  ) {}

  /**
   * Finds a single referral document by reference from the aggreggate.
   * @param reference The unique business reference.
   * @returns A Promise resolving to an IReferralReadModel or null.
   */
  async findByReference(reference: string): Promise<Referral | null> {
    const document = await this.referralModel.findOne({ reference }).exec();
    if (!document) {
      this.logger.debug(`[${ReferralReadModelDatabaseRepository.name}] No referral found with reference: ${reference}.`);
      return null;
    }
    this.logger.log(`[${ReferralReadModelDatabaseRepository.name}] Found referral with reference: ${reference}.`);
    return this.referralMapper.toDomain(document);
  }

  /**
   * Saves a Referral aggregate to the database.
   * This method performs an upsert operation: it creates the referral if it does not exist
   * (identified by its unique reference), or updates it if it already exists.
   *
   * @param referral The Referral aggregate to save.
   * @returns A Promise that resolves to void upon successful save.
   * @throws {Error} If there's a database error during the save operation.
   */
  async save(referral: Referral): Promise<void> {
    const persistenceObject = this.referralMapper.toPersistence(referral);
    if (!persistenceObject) {
      this.logger.error(`[${ReferralDatabaseRepository.name}] Attempted to save a null referral.`);
      throw new Error('Cannot save a null referral.');
    }

    const filter = { reference: referral.reference };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    await this.referralModel.findOneAndUpdate(filter, persistenceObject, options).exec();

    this.logger.log(`[${ReferralDatabaseRepository.name}] Referral saved: ${referral.reference}. (Created/Updated)`);
  }

  /**
   * Deletes a referral document from the database by its reference.
   * @param reference The unique business reference of the referral to delete.
   * @returns A Promise that resolves to true if a document was deleted, false otherwise.
   */
  async delete(reference: string): Promise<boolean> {
    const result = await this.referralModel.deleteOne({ reference }).exec();
    const isDeleted = result.deletedCount > 0;

    if (isDeleted) {
      this.logger.log(`[${ReferralDatabaseRepository.name}] Successfully deleted referral: ${reference}.`);
    } else {
      this.logger.warn(`[${ReferralDatabaseRepository.name}] Referral not found for deletion: ${reference}.`);
    }
    return isDeleted;
  }
}

@Injectable()
export class ReferralReadModelDatabaseRepository implements IReferralReadModelRepository {
  private readonly logger = new Logger(ReferralReadModelDatabaseRepository.name);

  constructor(
    @InjectModel(ReferralEntity.name)
    private referralModel: Model<ReferralDocument>,
    private readonly referralMapper: ReferralMapper,
  ) {}

  /**
   * Finds a single referral document by reference and maps it to a read model.
   * @param reference The unique business reference.
   * @returns A Promise resolving to an IReferralReadModel or null.
   */
  async findByReference(reference: string): Promise<IReferralReadModel | null> {
    const document = await this.referralModel.findOne({ reference }).exec();
    if (!document) {
      this.logger.debug(`[${ReferralReadModelDatabaseRepository.name}] No referral found with reference: ${reference}.`);
      return null;
    }
    this.logger.log(`[${ReferralReadModelDatabaseRepository.name}] Found referral with reference: ${reference}.`);
    return this.referralMapper.toReadModel(document);
  }

  /**
   * Finds all referral documents for a specific referee ID and maps them to read models.
   * @param refereeId The ID of the referee.
   * @returns A Promise resolving to an array of IReferralReadModel.
   */
  async findByRefereeId(refereeId: string): Promise<Array<IReferralReadModel>> {
    const documents = await this.referralModel.find({ refereeId }).exec();
    this.logger.log(`[Database] Found ${documents.length} referrals for referee ${refereeId}.`);
    return documents
      .map((document) => this.referralMapper.toReadModel(document))
      .filter((model): model is IReferralReadModel => model !== null);
  }

  /**
   * Finds all referral documents and maps them to read models.
   * @returns A Promise resolving to an array of all IReferralReadModel.
   */
  async findAll(): Promise<Array<IReferralReadModel>> {
    const documents = await this.referralModel.find().exec();
    this.logger.log(`[Database] Found ${documents.length} total referrals.`);
    return documents
      .map((document) => this.referralMapper.toReadModel(document))
      .filter((model): model is IReferralReadModel => model !== null);
  }
}
