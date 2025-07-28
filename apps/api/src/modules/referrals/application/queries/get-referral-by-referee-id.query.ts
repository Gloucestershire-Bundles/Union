import { Inject, Logger } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IReferralReadModel } from '@/modules/referrals/domain/models/referral-read-model.interface';
import {
  IReferralReadModelRepository,
  REFERRAL_READ_MODEL_REPOSITORY,
} from '@/referrals/domain/referral.repository';

/**
 * @class GetReferralsByRefereeIdQuery
 * @implements {IQuery}
 * @description Query to retrieve a list of referrals associated with a specific referee ID.
 */
export class GetReferralsByRefereeIdQuery implements IQuery {
  constructor(public readonly refereeId: string) {}
}

/**
 * @class GetReferralByReferenceHandler
 * @implements {IQueryHandler<GetReferralByReferenceQuery>}
 * @description Handles the GetReferralByReferenceQuery by retrieving a single
 * referral read model from the read model repository.
 */
@QueryHandler(GetReferralsByRefereeIdQuery)
export class GetReferralsByRefereeIdHandler
  implements IQueryHandler<GetReferralsByRefereeIdQuery>
{
  private readonly logger = new Logger(GetReferralsByRefereeIdHandler.name);

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
  async execute(
    query: GetReferralsByRefereeIdQuery,
  ): Promise<Array<IReferralReadModel>> {
    this.logger.debug(
      `[${GetReferralsByRefereeIdHandler.name}] Fetching referrals for referee: ${query.refereeId}.`,
    );

    const referrals = await this.referralReadModelRepository.findByRefereeId(query.refereeId);

    this.logger.log(`[${GetReferralsByRefereeIdHandler.name}] Found ${referrals.length} referrals for referee: ${query.refereeId}.`);
    return referrals;
  }
}
