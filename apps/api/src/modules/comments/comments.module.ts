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

const CommandHandlers = [];
const QueryHandlers = [];
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
