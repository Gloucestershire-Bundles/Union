import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, collection: 'comments' })
export class CommentEntity {
  @Prop({ required: true, index: true })
  authorId: string;

  @Prop({ required: true, index: true })
  referralId: string;

  @Prop({ required: true })
  content: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CommentSchema = SchemaFactory.createForClass(CommentEntity);

CommentSchema.index({ referralId: 1, createdAt: -1 });
CommentSchema.index({ authorId: 1, createdAt: -1 });

export type CommentDocument = HydratedDocument<CommentEntity>;
