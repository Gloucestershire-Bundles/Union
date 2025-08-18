import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReferralsQuery } from './get-referrals.query';
import {
  IReferralReadModelRepository,
  REFERRAL_READ_MODEL_REPOSITORY,
} from '@/referrals/domain/read-model/referral-read-model.repository';
import { Inject, Logger } from '@nestjs/common';
import { IReferralReadModel } from '@/referrals/domain/read-model/referral-read-model.interface';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_query: GetReferralsQuery): Promise<Array<IReferralReadModel>> {
    this.logger.debug(`[${GetReferralsHandler.name}] Fetching all referrals.`);

    const referrals = await this.referralReadModelRepository.findAll();

    this.logger.log(
      `[${GetReferralsHandler.name}] Found ${referrals.length} total referrals.`,
    );
    return referrals;
  }
}
