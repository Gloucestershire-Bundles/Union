import { NotFoundException } from '@nestjs/common';

/**
 * Exception for when a Comment cannot be found.
 */
export class CommentNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Referral with ID ${id} not found.`);
  }
}
