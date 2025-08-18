import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CommentEntity,
  CommentSchema,
} from '@/comments/schemas/comment.schema';
import { CommentsController } from '@/comments/comments.controller';
import { AuthModule } from '@/auth/auth.module';
import { CommentsService } from '@/comments/comments.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: CommentEntity.name, schema: CommentSchema },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
