import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, collection: 'comments' })
export class CommentEntity {
  @Prop({ required: true })
  authorId: string;

  @Prop({ required: true })
  referralId: string;

  @Prop({ required: true })
  content: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CommentSchema = SchemaFactory.createForClass(CommentEntity);
export type CommentDocument = HydratedDocument<CommentEntity>;
