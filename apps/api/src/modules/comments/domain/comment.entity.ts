import { AggregateRoot } from '@nestjs/cqrs';

export interface CommentProps {
  authorId: string;
  referralReference: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Comment extends AggregateRoot implements CommentProps {
  authorId: string;
  referralReference: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: CommentProps) {
    super();
    Object.assign(this, props);
  }

  static save(authorId: string, referralReference: string, content: string) {
    const comment = new Comment({
      authorId: authorId,
      referralReference: referralReference,
      content: content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return comment;
  }

  /**
   * Updates the mutable content of the comment.
   * This method applies changes to the `content` value object.
   *
   * @param newContent The new content to apply to the comment.
   */
  updateContent(newContent: string): void {
    if (this.content === newContent) {
      return;
    }

    this.content = newContent;
    this.updatedAt = new Date();
  }
}
