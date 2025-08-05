import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentEntity, CommentSchema } from '@/comments/infrastructure/comment.schema';
import { COMMENT_REPOSITORY } from '@/comments/domain/comment.repository';
import {
  CommentDatabaseRepository,
  CommentReadModelDatabaseRepository,
} from '@/comments/infrastructure/comment.database-repository';
import { COMMENT_READ_MODEL_REPOSITORY } from '@/comments/domain/read-model/comment-read-model.repository';
import { CommentMapper } from '@/comments/application/comment.mapper';
import { CreateCommentHandler } from './application/commands/create/create-comment.handler';
import { UpdateCommentHandler } from './application/commands/update/update-comment.handler';
import { DeleteCommentHandler } from './application/commands/delete/delete-comment.handler';
import { GetCommentByIdHandler } from './application/queries/get-by-id/get-comment-by-id.handler';
import { GetCommentByReferralHandler } from './application/queries/get-by-referral/get-comment-by-referral.handler';
import { CommentsController } from './comments.controller';

const CommandHandlers = [
  CreateCommentHandler,
  UpdateCommentHandler,
  DeleteCommentHandler,
];
const QueryHandlers = [
  GetCommentByIdHandler,
  GetCommentByReferralHandler,
];
const EventHandlers = [];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: CommentEntity.name, schema: CommentSchema },
    ]),
  ],
  controllers: [CommentsController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    {
      provide: COMMENT_REPOSITORY,
      useClass: CommentDatabaseRepository,
    },
    {
      provide: COMMENT_READ_MODEL_REPOSITORY,
      useClass: CommentReadModelDatabaseRepository,
    },
    CommentMapper,
  ],
})
export class CommentsModule {}
