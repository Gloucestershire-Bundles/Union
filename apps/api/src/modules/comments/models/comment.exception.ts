import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

export class CommentNotFoundException extends NotFoundException {
  constructor(commentId?: string) {
    super(
      commentId
        ? `Comment with ID ${commentId} not found.`
        : 'Comment not found.',
    );
  }
}

export class CommentForbiddenException extends ForbiddenException {
  constructor(
    message: string = 'You do not have permission to perform this action on the comment.',
  ) {
    super(message);
  }
}
