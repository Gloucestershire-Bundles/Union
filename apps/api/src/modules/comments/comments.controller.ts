import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Request } from 'express';
import { ClerkUser } from '../auth/interfaces/clerk-user.interface';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { CommentForbiddenException, CommentNotFoundException } from './models/comment.exception';

@Controller('/v1/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

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
    return this.commentsService.create(createCommentDto, user.id);
  }

  /**
   * Handles GET /v1/referrals/referral/:referralId endpoint to retrieve comments by referral ID.
   * @param referralId The ID of the referral.
   * @returns A Promise that resolves with an array of Comment.
   * Returns an empty array if no comments are found for the given referral ID.
   * @throws {CommentForbiddenException} If the user is not authorized to view these comments.
   */
  @Get('/referral/:referralId')
  @Roles(Role.VOLUNTEER, Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  async findAllByReferral(
    @Param('referralId') referralId: string,
    @Req() req: Request,
  ) {
    const user = req.user as ClerkUser;

    if (!(user.publicMetadata.role === Role.ADMINISTRATOR ||
          user.publicMetadata.role === Role.VOLUNTEER)) {
      throw new CommentForbiddenException('You are not authorized to view comments on this referral.');
    }
    
    return this.commentsService.findAllByReferral(referralId);
  }

  /**
   * Handles GET /v1/referrals/:id endpoint to retrieve a single comment.
   * @param id The unique ID of the comment to retrieve.
   * @returns A Promise that resolves with the Comment type.
   * @throws {CommentNotFoundException} If the comment with the given ID is not found.
   */
  @Get(':id')
  @Roles(Role.VOLUNTEER, Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const comment = await this.commentsService.findOne(id);
    if (!comment) throw new CommentNotFoundException(id);
    return comment;
  }

  /**
   * Handles PATCH /v1/referrals/:id to update ONLY the mutable content of a comment.
   * This is a partial update for the comment's data.
   * @param id The unique ID of the comment.
   * @param updateCommentDto The DTO containing the new content.
   * @returns A success message.
   * @throws {CommentNotFoundException} If the comment is not found.
   */
  @Patch(':id')
  @Roles(Role.VOLUNTEER, Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.commentsService.update(id, updateCommentDto);
    if (!comment) throw new CommentNotFoundException(id);
    return comment;
  }

  /**
   * Handles the DELETE /v1/comments/:id endpoint to permanently delete a comment.
   * @param id The unique ID of the comment to delete.
   * @returns A success message if the comment is deleted.
   * @throws {CommentNotFoundException} If the comment with the given ID is not found.
   * @throws {InternalServerErrorException} For any unexpected errors during deletion.
   */
  @Delete(':id')
  @Roles(Role.VOLUNTEER, Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const isDeleted = await this.commentsService.delete(id);
    if (!isDeleted) throw new CommentNotFoundException(id);
  }
}
