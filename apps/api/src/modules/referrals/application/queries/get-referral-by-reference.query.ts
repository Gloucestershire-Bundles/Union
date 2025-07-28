import { Inject, Logger } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  IReferralReadModelRepository,
  REFERRAL_READ_MODEL_REPOSITORY,
} from '@/referrals/domain/referral.repository';
import { IReferralReadModel } from '@/modules/referrals/domain/models/referral-read-model.interface';
import { ReferralNotFoundException } from '../../domain/referral.exception';

/**
 * @class GetReferralByReferenceQuery
 * @implements {IQuery}
 * @description Query to retrieve a single referral by its unique business reference.
 */
export class GetReferralByReferenceQuery implements IQuery {
  constructor(public readonly reference: string) {}
}

/**
 * @class GetReferralByReferenceHandler
 * @implements {IQueryHandler<GetReferralByReferenceQuery>}
 * @description Handles the GetReferralByReferenceQuery by retrieving a single
 * referral read model from the read model repository.
 */
@QueryHandler(GetReferralByReferenceQuery)
export class GetReferralByReferenceHandler
  implements IQueryHandler<GetReferralByReferenceQuery>
{
  private readonly logger = new Logger(GetReferralByReferenceHandler.name);

  constructor(
    @Inject(REFERRAL_READ_MODEL_REPOSITORY)
    private readonly referralReadModelRepository: IReferralReadModelRepository,
  ) {}

  /**
   * Executes the GetReferralByReferenceQuery.
   * @param query The query containing the referral reference.
   * @returns A Promise that resolves with the IReferralReadModel if found.
   * @throws {ReferralNotFoundException} If the referral is not found.
   */
  async execute(query: GetReferralByReferenceQuery): Promise<IReferralReadModel> {
    this.logger.debug(`[${GetReferralByReferenceHandler.name}] Fetching referral with reference: ${query.reference}.`);

    const referral = await this.referralReadModelRepository.findByReference(query.reference);
    if (!referral) throw new ReferralNotFoundException(query.reference);

    this.logger.log(`[${GetReferralByReferenceHandler.name}] Found referral: ${query.reference}.`);
    return referral;
  }
}
