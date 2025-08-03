import { ICommentReadModel } from '@/comments/domain/read-model/comment-read-model.interface';

export const COMMENT_READ_MODEL_REPOSITORY = 'COMMENT_READ_MODEL_REPOSITORY';

/**
 * @interface ICommentReadModelRepository
 * @description Defines the contract for read operations on the Comment Read Model.
 * This repository is optimized for querying and retrieving data for display.
 */
export interface ICommentReadModelRepository {
  /**
   * Finds a single comment read model by its unique ID.
   * @param id The unique ID of the comment.
   * @returns A Promise that resolves with the ICommentReadModel if found, otherwise null.
   */
  findById(id: string): Promise<ICommentReadModel | null>;

  /**
   * Finds all comment read models associated with a specific referral ID.
   * @param referralReference The ID of the referral.
   * @returns A Promise that resolves with an array of ICommentReadModel.
   * Returns an empty array if no comments are found for the given referral.
   */
  findByReferral(reference: string): Promise<Array<ICommentReadModel>>;
}
