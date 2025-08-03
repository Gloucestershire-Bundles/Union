import { IQuery } from '@nestjs/cqrs';

/**
 * @class GetCommentByReferralQuery
 * @implements {IQuery}
 * @description Query to retrieve an array of comments by a referral reference.
 */
export class GetCommentByReferralQuery implements IQuery {
  constructor(public readonly reference: string) {}
}