export class CommentCreatedEvent {
  constructor(
    public readonly authorId: string,
    public readonly referralReference: string,
    public readonly content: string,
  ) {}
}
