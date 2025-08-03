import { ICommand } from "@nestjs/cqrs";

/**
 * @class DeleteCommentCommand
 * @implements {ICommand}
 * @description Command to initiate the permanent deletion of a comment.
 * Uses the unique ID to identify the comment.
 */
export class DeleteCommentCommand implements ICommand {
  /**
   * @param id The unique ID of the comment.
   */
  constructor(public readonly id: string) {}
}