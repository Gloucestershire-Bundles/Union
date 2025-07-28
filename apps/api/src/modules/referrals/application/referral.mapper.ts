import { Injectable } from '@nestjs/common';
import {
  ReferralDocument,
  ReferralEntity,
} from '../infrastructure/referral.schema';
import { Referral } from '../domain/referral.entity';
import { ReferralStatus } from '@/common/enums/referral-status.enum';
import { IReferralReadModel } from '../domain/models/referral-read-model.interface';

@Injectable()
export class ReferralMapper {
  /**
   * Maps a Mongoose ReferralDocument (from the database) to a Referral Domain Entity.
   * This is used when loading an aggregate root from persistence to be used in the domain layer.
   *
   * @param document The Mongoose ReferralDocument to map.
   * @returns A Referral Domain Entity instance if the document is provided, otherwise null.
   */
  public toDomain(document: ReferralDocument): Referral | null {
    if (!document) return null;

    return new Referral({
      reference: document.reference,
      refereeId: document.refereeId,
      details: document.details,
      status: document.status as ReferralStatus,
      withdrawnAt: document.withdrawnAt,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  /**
   * Maps a Referral Domain Entity to a Partial<ReferralEntity> (for persistence).
   * This is used when saving or updating a Referral aggregate root in the database.
   * Mongoose will typically handle `_id`, `__v`, `createdAt`, and `updatedAt` automatically
   * when `timestamps: true` is enabled on the schema.
   *
   * @param referral The Referral Domain Entity to map.
   * @returns A Partial<ReferralEntity> object suitable for Mongoose operations, or null if the entity is not provided.
   */
  public toPersistence(referral: Referral): Partial<ReferralEntity> | null {
    if (!referral) return null;

    return {
      reference: referral.reference,
      refereeId: referral.refereeId,
      details: referral.details,
      status: referral.status,
      withdrawnAt: referral.withdrawnAt,
    };
  }

  /**
   * Maps a Mongoose ReferralDocument to an IReferralReadModel.
   * This is used for generating read-optimized data for queries and API responses.
   * @param document The Mongoose ReferralDocument to map.
   * @returns An IReferralReadModel instance if the document is provided, otherwise null.
   */
  public toReadModel(document: ReferralDocument): IReferralReadModel | null {
    if (!document) return null;

    return {
      reference: document.reference,
      refereeId: document.refereeId,
      details: document.details,
      status: document.status,
      withdrawnAt: document.withdrawnAt,
      createdAt: document.createdAt ?? new Date(),
      updatedAt: document.updatedAt ?? new Date(),
    };
  }
}
