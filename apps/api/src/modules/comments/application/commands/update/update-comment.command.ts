import { ICommand } from "@nestjs/cqrs";

/**
 * @class UpdateCommentCommand
 * @implements {ICommand}
 * @description Command to initiate the update of a comment.
 * Contains all necessary data to update a Comment Aggregate.
 */
export class UpdateCommentCommand implements ICommand {
  /**
   * @param id The unique ID for the comment.
   * @param newContent The updated information for the comment.
   */
  constructor(
    public readonly id: string,
    public readonly newContent: string,
  ) {}
}
