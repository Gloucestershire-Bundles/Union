import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentDocument, CommentEntity } from './schemas/comment.schema';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Comment } from './models/comment.type';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(CommentEntity.name)
    private commentModel: Model<CommentDocument>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    authorId: string,
  ): Promise<Comment> {
    const comment = new this.commentModel({
      authorId,
      ...createCommentDto,
    });
    return comment.save();
  }

  async findAllByReferral(referralId: string): Promise<Array<Comment>> {
    return this.commentModel.find({ referralId }).exec();
  }

  async findOne(id: string): Promise<Comment | null> {
    return this.commentModel.findById(id).exec();
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment | null> {
    const comment = await this.commentModel.findById(id).exec();

    if (!comment) return null;

    comment.set(updateCommentDto);
    return comment.save();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.commentModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
