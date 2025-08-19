import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentDocument, CommentEntity } from '@/comments/schemas/comment.schema';
import { Model } from 'mongoose';
import { CreateCommentDto } from '@/comments/dtos/create-comment.dto';
import { Comment } from '@/comments/models/comment.type';
import { UpdateCommentDto } from '@/comments/dtos/update-comment.dto';

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

  async findAllByReferral(
    referralId: string,
    limit: number = 100,
    skip: number = 0,
  ): Promise<Array<Comment>> {
    return this.commentModel
      .find({ referralId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async findByAuthor(
    authorId: string,
    limit: number = 50,
    skip: number = 0,
  ): Promise<Array<Comment>> {
    return this.commentModel
      .find({ authorId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async getCommentCount(referralId: string): Promise<number> {
    return this.commentModel.countDocuments({ referralId });
  }

  async findOne(id: string): Promise<Comment | null> {
    return this.commentModel.findById(id).exec();
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment | null> {
    return this.commentModel
      .findByIdAndUpdate(id, updateCommentDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.commentModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
