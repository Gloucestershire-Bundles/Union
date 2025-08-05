import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCommentDto } from './application/dtos/create-comment.dto';
import { CreateCommentCommand } from './application/commands/create/create-comment.command';
import { Request } from 'express';
import { ClerkUser } from '../auth/interfaces/clerk-user.interface';
import { ICommentReadModel } from './domain/read-model/comment-read-model.interface';
import { GetCommentByReferralQuery } from './application/queries/get-by-referral/get-comment-by-referral.query';
import { GetCommentByIdQuery } from './application/queries/get-by-id/get-comment-by-id.query';
import { CommentNotFoundException } from './domain/comment.exception';
import { DeleteCommentCommand } from './application/commands/delete/delete-comment.command';
import { UpdateCommentDto } from './application/dtos/update-comment.dto';
import { UpdateCommentCommand } from './application/commands/update/update-comment.command';

@Controller('/v1/comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Handles the POST /v1/comments endpoint to create a new comment.
   * @param createCommentDto The data for the new comment.
   * @returns A Promise that resolves with details of the created comment.
   * @throws {InternalServerErrorException} For any other unexpected errors.
   */
  @Post()
  @Roles(Role.VOLUNTEER, Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    const user = req.user as ClerkUser;
    const command = new CreateCommentCommand(
      user.id,
      createCommentDto.referralId,
      createCommentDto.content,
    );

    try {
      const comment = await this.commandBus.execute(command);
      return {
        message: 'Comment created successfully.',
        authorId: comment.authorId,
        referralId: comment.referralId,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handles GET /v1/referrals/referral/:referralId endpoint to retrieve comments by referral ID.
   * @param referralId The ID of the referral.
   * @returns A Promise that resolves with an array of ICommentReadModel.
   * Returns an empty array if no comments are found for the given referral ID.
   */
  @Get('/referral/:referralId')
  @Roles(Role.VOLUNTEER, Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  async getCommentsByReferral(
    @Param('referralId') referralId: string,
    @Req() req: Request,
  ): Promise<Array<ICommentReadModel>> {
    const user = req.user as ClerkUser;
    const query = new GetCommentByReferralQuery(referralId);
    if (
      !(
        user.publicMetadata.role === Role.ADMINISTRATOR ||
        user.publicMetadata.role === Role.VOLUNTEER
      )
    ) {
      throw new ForbiddenException(
        'You are not authorised to view these comments on this referral.',
      );
    }
    const comments = await this.queryBus.execute(query);
    return comments;
  }

  /**
   * Handles GET /v1/referrals/:id endpoint to retrieve a single comment.
   * @param id The unique ID of the comment to retrieve.
   * @returns A Promise that resolves with the ICommentReadModel.
   * @throws {CommentNotFoundException} If the comment with the given ID is not found.
   */
  @Get(':id')
  @Roles(Role.VOLUNTEER, Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  async getCommentById(@Param('id') id: string): Promise<ICommentReadModel> {
    const query = new GetCommentByIdQuery(id);
    try {
      const comment = await this.queryBus.execute(query);
      return comment;
    } catch (error) {
      if (error instanceof CommentNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  /**
   * Handles PATCH /v1/referrals/:id to update ONLY the mutable content of a comment.
   * This is a partial update for the comment's data.
   * @param id The unique ID of the comment.
   * @param updateCommentDto The DTO containing the new content.
   * @returns A success message.
   * @throws {NotFoundException} If the comment is not found.
   */
  @Patch(':id')
  @Roles(Role.VOLUNTEER, Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const domainContent: string = updateCommentDto.content;
    const command = new UpdateCommentCommand(id, domainContent);

    try {
      await this.commandBus.execute(command);
      return { message: `Comment ${id} content updated.` };
    } catch (error) {
      if (error instanceof CommentNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  /**
   * Handles the DELETE /v1/comments/:id endpoint to permanently delete a comment.
   * @param id The unique ID of the comment to delete.
   * @returns A success message if the comment is deleted.
   * @throws {NotFoundException} If the comment with the given ID is not found.
   * @throws {InternalServerErrorException} For any unexpected errors during deletion.
   */
  @Delete(':id')
  @Roles(Role.VOLUNTEER, Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const command = new DeleteCommentCommand(id);
    try {
      await this.commandBus.execute(command);
      return;
    } catch (error) {
      if (error instanceof CommentNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
