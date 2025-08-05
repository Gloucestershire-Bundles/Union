import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCommentCommand } from './update-comment.command';
import { ConflictException, Inject, Logger } from '@nestjs/common';
import {
  COMMENT_REPOSITORY,
  ICommentRepository,
} from '@/comments/domain/comment.repository';
import { CommentNotFoundException } from '@/comments/domain/comment.exception';

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler
  implements ICommandHandler<UpdateCommentCommand>
{
  private readonly logger = new Logger(UpdateCommentHandler.name);

  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateCommentCommand): Promise<void> {
    const { id, newContent } = command;

    this.logger.debug(
      `[${UpdateCommentHandler.name}] Attempting to update content for comment ${id}.`,
    );

    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new CommentNotFoundException(id);
    }

    const mergedComment = this.publisher.mergeObjectContext(comment);

    try {
      const domainContent: string = newContent;
      mergedComment.updateContent(domainContent);
    } catch (error) {
      this.logger.warn(
        `[${UpdateCommentHandler.name}] Failed to update content for comment ${id}: ${error.message}.`,
      );
      throw new ConflictException(error.message);
    }

    await this.commentRepository.save(mergedComment);
    mergedComment.commit();

    this.logger.log(
      `[${UpdateCommentHandler.name}] Comment ${id} content updated.`,
    );
  }
}
