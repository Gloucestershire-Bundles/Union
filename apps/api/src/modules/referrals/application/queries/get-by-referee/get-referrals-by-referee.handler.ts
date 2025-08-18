import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReferralsByRefereeQuery } from '@/referrals/application/queries/get-by-referee/get-referrals-by-referee.query';
import { Inject, Logger } from '@nestjs/common';
import {
  IReferralReadModelRepository,
  REFERRAL_READ_MODEL_REPOSITORY,
} from '@/referrals/domain/read-model/referral-read-model.repository';
import { IReferralReadModel } from '@/referrals/domain/read-model/referral-read-model.interface';

/**
 * @class GetReferralsByRefereeHandler
 * @implements {IQueryHandler<GetReferralByRefereeQuery>}
 * @description Handles the GetReferralByRefereeQuery by retrieving a single
 * referral read model from the read model repository.
 */
@QueryHandler(GetReferralsByRefereeQuery)
export class GetReferralsByRefereeHandler
  implements IQueryHandler<GetReferralsByRefereeQuery>
{
  private readonly logger = new Logger(GetReferralsByRefereeHandler.name);

  constructor(
    @Inject(REFERRAL_READ_MODEL_REPOSITORY)
    private readonly referralReadModelRepository: IReferralReadModelRepository,
  ) {}

  /**
   * Executes the GetReferralByReferenceQuery.
   * @param query The query containing the referral reference.
   * @returns A Promise that resolves with the IReferralReadModel if found.
   */
  async execute(
    query: GetReferralsByRefereeQuery,
  ): Promise<Array<IReferralReadModel>> {
    this.logger.debug(
      `[${GetReferralsByRefereeHandler.name}] Fetching referrals for referee: ${query.refereeId}.`,
    );

    const referrals = await this.referralReadModelRepository.findByRefereeId(
      query.refereeId,
    );

    this.logger.log(
      `[${GetReferralsByRefereeHandler.name}] Found ${referrals.length} referrals for referee: ${query.refereeId}.`,
    );
    return referrals;
  }
}
