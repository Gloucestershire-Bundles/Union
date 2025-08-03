import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetCommentByIdQuery } from "./get-comment-by-id.query";
import { Inject, Logger } from "@nestjs/common";
import { COMMENT_READ_MODEL_REPOSITORY, ICommentReadModelRepository } from "@/modules/comments/domain/read-model/comment-read-model.repository";
import { CommentNotFoundException } from "@/modules/comments/domain/comment.exception";
import { ICommentReadModel } from "@/modules/comments/domain/read-model/comment-read-model.interface";

/**
 * @class GetCommentByIdHandler
 * @implements {IQueryHandler<GetCommentByIdQuery>}
 * @description Handles the GetCommentByIdQuery by retrieving a single
 * comment read model from the read model repository.
 */
@QueryHandler(GetCommentByIdQuery)
export class GetCommentByIdHandler implements IQueryHandler<GetCommentByIdQuery> {
  private readonly logger = new Logger(GetCommentByIdHandler.name);

  constructor(
    @Inject(COMMENT_READ_MODEL_REPOSITORY)
    private readonly commentReadModelRepository: ICommentReadModelRepository,
  ) {}

  /**
   * Executes the GetCommentByIdQuery.
   * @param query The query containing the comment ID.
   * @returns A Promise that resolves with the ICommentReadModel if found.
   * @throws {CommentNotFoundException} If the comment is not found.
   */
  async execute(
    query: GetCommentByIdQuery,
  ): Promise<ICommentReadModel> {
    this.logger.debug(`[${GetCommentByIdHandler.name}] Fetching comment with ID: ${query.id}.`);

    const comment = await this.commentReadModelRepository.findById(query.id,);
    if (!comment) throw new CommentNotFoundException(query.id);

    this.logger.log(`[${GetCommentByIdHandler.name}] Found comment: ${query.id}.`);
    return comment;
  }
}
