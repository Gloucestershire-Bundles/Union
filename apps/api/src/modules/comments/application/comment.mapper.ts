import { Injectable } from '@nestjs/common';
import {
  CommentDocument,
  CommentEntity,
} from '@/comments/infrastructure/comment.schema';
import { Comment } from '@/comments/domain/comment.entity';
import { ICommentReadModel } from '@/comments/domain/read-model/comment-read-model.interface';

@Injectable()
export class CommentMapper {
  /**
   * Maps a Mongoose CommentDocument (from the database) to a Comment Domain Entity.
   * This is used when loading an aggregate root from persistence to be used in the domain layer.
   *
   * @param document The Mongoose CommentDocument to map.
   * @returns A Comment Domain Entity instance if the document is provided, otherwise null.
   */
  public toDomain(document: CommentDocument): Comment | null {
    if (!document) return null;
    return new Comment({
      authorId: document.authorId,
      referralReference: document.referralReference,
      content: document.content,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  /**
   * Maps a Comment Domain Entity to a Partial<CommentEntity> (for persistence).
   * This is used when saving or updating a Comment aggregate root in the database.
   * Mongoose will typically handle `_id`, `__v`, `createdAt`, and `updatedAt` automatically
   * when `timestamps: true` is enabled on the schema.
   *
   * @param comment The Comment Domain Entity to map.
   * @returns A Partial<CommentEntity> object suitable for Mongoose operations, or null if the entity is not provided.
   */
  public toPersistence(comment: Comment): Partial<CommentEntity> | null {
    if (!comment) return null;
    return {
      authorId: comment.authorId,
      referralReference: comment.referralReference,
      content: comment.content,
    };
  }

  /**
   * Maps a Mongoose CommentDocument to an ICommentReadModel.
   * This is used for generating read-optimized data for queries and API responses.
   * @param document The Mongoose CommentDocument to map.
   * @returns An ICommentReadModel instance if the document is provided, otherwise null.
   */
  public toReadModel(document: CommentDocument): ICommentReadModel | null {
    if (!document) return null;
    return {
      authorId: document.authorId,
      referralReference: document.referralReference,
      content: document.content,
      createdAt: document.createdAt ?? new Date(),
      updatedAt: document.updatedAt ?? new Date(),
    };
  }
}
