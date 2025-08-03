import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetCommentByReferralQuery } from "@/comments/application/queries/get-by-referral/get-comment-by-referral.query";
import { Inject, Logger } from "@nestjs/common";
import { COMMENT_READ_MODEL_REPOSITORY, ICommentReadModelRepository } from "@/comments/domain/read-model/comment-read-model.repository";
import { ICommentReadModel } from "@/comments/domain/read-model/comment-read-model.interface";

/**
 * @class GetCommentByReferralHandler
 * @implements {IQueryHandler<GetCommentByReferralQuery>}
 * @description Handles the GetCommentByReferralQuery by retrieving an array of
 * comment read model from the read model repository.
 */
@QueryHandler(GetCommentByReferralQuery)
export class GetCommentByReferralHandler implements IQueryHandler<GetCommentByReferralQuery> {
  private readonly logger = new Logger(GetCommentByReferralHandler.name);

  constructor(
    @Inject(COMMENT_READ_MODEL_REPOSITORY)
    private readonly commentReadModelRepository: ICommentReadModelRepository,
  ) {}

  /**
   * Executes the GetCommentByReferralQuery.
   * @param query The query containing the comment reference.
   * @returns A Promise that resolves with the ICommentReadModel if found.
   */
  async execute(query: GetCommentByReferralQuery): Promise<Array<ICommentReadModel>> {
    this.logger.debug(`[${GetCommentByReferralHandler.name}] Fetching comments for referral: ${query.reference}.`);
    
    const comments = await this.commentReadModelRepository.findByreferralReference(query.reference);
    
    this.logger.log(`[${GetCommentByReferralHandler.name}] Found ${comments.length} comments for referral ${query.reference}`);
    return comments;
  }
}