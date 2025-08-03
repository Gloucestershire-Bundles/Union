import { Comment } from '@/comments/domain/comment.entity';

export const COMMENT_REPOSITORY = 'COMMENT_REPOSITORY';

/**
 * @interface ICommentRepository
 * @description Defines the contract for persistence operations on the Comment Aggregate.
 * This repository manages the state of the Comment entity.
 */
export interface ICommentRepository {
  /**
   * Loads a Comment aggregate by its unique ID.
   * This is used by command handlers to retrieve the current state of an aggregate
   * for modifications.
   * @param id The unique ID of the comment to load.
   * @returns A Promise that resolves with the Comment aggregate if found, otherwise null.
   */
  findById(id: string): Promise<Comment | null>;

  /**
   * Creates a Comment aggregate.
   * @param comment The Comment aggregate to save.
   * @returns A Promise that resolves when the operation is complete.
   */
  save(comment: Comment): Promise<void>;

  /**
   * Deletes a Comment record permanently from the persistence layer.
   * This is a hard delete and should be used with caution.
   * @param id The unique ID of the comment to delete.
   * @returns A Promise that resolves to true if the comment was found and deleted, false otherwise.
   */
  delete(id: string): Promise<boolean>;
}
