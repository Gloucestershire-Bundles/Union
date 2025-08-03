import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentCommand } from './create-comment.command';
import { Inject, Logger } from '@nestjs/common';
import {
  COMMENT_REPOSITORY,
  ICommentRepository,
} from '@/comments/domain/comment.repository';
import { Comment } from '@/comments/domain/comment.entity';


@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  private readonly logger = new Logger(CreateCommentHandler.name);

  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateCommentCommand): Promise<Comment> {
    const { authorId, referralId, content } = command;

    this.logger.debug(
      `[${CreateCommentHandler.name}] Attempting to create comment for author ${authorId}.`,
    );
    const comment = this.publisher.mergeObjectContext(
      Comment.save(authorId, referralId, content),
    );

    try {
      await this.commentRepository.save(comment);
    } catch (error) {
      this.logger.error(
        `[${CreateCommentHandler.name}] Failed to create comment for author ${authorId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }

    comment.commit();

    this.logger.log(
      `[${CreateCommentHandler.name}] Comment for ${comment.authorId} successfully created.`,
    );
    return comment;
  }
}
