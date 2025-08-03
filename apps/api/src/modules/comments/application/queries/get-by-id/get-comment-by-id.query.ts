import { IQuery } from '@nestjs/cqrs';

/**
 * @class GetCommentById
 * @implements {IQuery}
 * @description Query to retrieve a single comment by ID.
 */
export class GetCommentByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}