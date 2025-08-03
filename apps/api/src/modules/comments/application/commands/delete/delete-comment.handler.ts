import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCommentCommand } from './delete-comment.command';
import { Inject, Logger } from '@nestjs/common';
import {
  COMMENT_REPOSITORY,
  ICommentRepository,
} from '@/modules/comments/domain/comment.repository';
import { CommentNotFoundException } from '@/modules/comments/domain/comment.exception';

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  private readonly logger = new Logger(DeleteCommentHandler.name);

  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(command: DeleteCommentCommand): Promise<void> {
    const { id } = command;

    this.logger.debug(
      `[${DeleteCommentHandler.name}] Attempting to delete comment: ${id}.`,
    );

    const isDeleted = await this.commentRepository.delete(id);
    if (isDeleted) throw new CommentNotFoundException(id);

    this.logger.log(
      `[${DeleteCommentHandler.name}] Comment with ID ${id} successfully deleted.`,
    );
  }
}
