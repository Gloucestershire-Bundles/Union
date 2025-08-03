import { ICommand } from '@nestjs/cqrs';

export class CreateCommentCommand implements ICommand {
  constructor(
    public readonly authorId: string,
    public readonly referralId: string,
    public readonly content: string,
  ) {}
}
