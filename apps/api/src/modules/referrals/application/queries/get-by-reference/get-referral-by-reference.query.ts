import { IQuery } from '@nestjs/cqrs';

/**
 * @class GetReferralByReferenceQuery
 * @implements {IQuery}
 * @description Query to retrieve a single referral by its unique business reference.
 */
export class GetReferralByReferenceQuery implements IQuery {
  constructor(public readonly reference: string) {}
}
