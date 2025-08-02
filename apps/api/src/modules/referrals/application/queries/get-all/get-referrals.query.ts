import { IQuery } from '@nestjs/cqrs';

/**
 * @class GetReferralsQuery
 * @implements {IQuery}
 * @description Query to retrieve all referrals in the system.
 */
export class GetReferralsQuery implements IQuery {
  constructor() {}
}