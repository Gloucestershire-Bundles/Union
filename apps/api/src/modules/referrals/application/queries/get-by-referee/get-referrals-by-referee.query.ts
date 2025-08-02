import { IQuery } from '@nestjs/cqrs';

/**
 * @class GetReferralsByRefereeQuery
 * @implements {IQuery}
 * @description Query to retrieve a list of referrals associated with a specific referee ID.
 */
export class GetReferralsByRefereeQuery implements IQuery {
  constructor(public readonly refereeId: string) {}
}