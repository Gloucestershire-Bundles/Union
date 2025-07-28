import { Inject, Logger } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IReferralReadModelRepository, REFERRAL_READ_MODEL_REPOSITORY } from '@/referrals/domain/referral.repository';
import { IReferralReadModel } from '@/modules/referrals/domain/models/referral-read-model.interface';

/**
 * @class GetReferralsQuery
 * @implements {IQuery}
 * @description Query to retrieve all referrals in the system.
 */
export class GetReferralsQuery implements IQuery {
  constructor() {}
}

/**
 * @class GetReferralsHandler
 * @implements {IQueryHandler<GetReferralsQuery>}
 * @description Handles the GetReferralsQuery by retrieving all referral read models.
 */
@QueryHandler(GetReferralsQuery)
export class GetReferralsHandler implements IQueryHandler<GetReferralsQuery> {
  private readonly logger = new Logger(GetReferralsHandler.name);

  constructor(
    @Inject(REFERRAL_READ_MODEL_REPOSITORY)
    private readonly referralReadModelRepository: IReferralReadModelRepository,
  ) {}

  /**
   * Executes the GetReferralsQuery.
   * @param _query The query object (not used for this specific query, hence `_`).
   * @returns A Promise that resolves with an array of all IReferralReadModel.
   * This array may be empty if no referrals exist in the system.
   */
  async execute(_query: GetReferralsQuery): Promise<Array<IReferralReadModel>> {
    this.logger.debug(`[${GetReferralsHandler.name}] Fetching all referrals.`);

    const referrals = await this.referralReadModelRepository.findAll();

    this.logger.log(`[${GetReferralsHandler.name}] Found ${referrals.length} total referrals.`);
    return referrals;
  }
}