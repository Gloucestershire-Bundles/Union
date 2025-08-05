import { Injectable, Logger } from '@nestjs/common';
import { ICommentRepository } from '@/comments/domain/comment.repository';
import { Comment } from '@/comments/domain/comment.entity';
import { ICommentReadModelRepository } from '@/comments/domain/read-model/comment-read-model.repository';
import { InjectModel } from '@nestjs/mongoose';
import { CommentDocument, CommentEntity } from '@/comments/infrastructure/comment.schema';
import { Model } from 'mongoose';
import { ICommentReadModel } from '@/comments/domain/read-model/comment-read-model.interface';
import { CommentMapper } from '@/comments/application/comment.mapper';

@Injectable()
export class CommentDatabaseRepository implements ICommentRepository {
  private readonly logger = new Logger(CommentDatabaseRepository.name);

  constructor(
    @InjectModel(CommentEntity.name)
    private commentModel: Model<CommentDocument>,
    private readonly commentMapper: CommentMapper,
  ) {}

  findById(id: string): Promise<Comment | null> {
    throw new Error('Method not implemented.');
  }

  save(comment: Comment): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

@Injectable()
export class CommentReadModelDatabaseRepository implements ICommentReadModelRepository {
  private readonly logger = new Logger(CommentReadModelDatabaseRepository.name);

  constructor(
    @InjectModel(CommentEntity.name)
    private commentModel: Model<CommentDocument>,
    private readonly commentMapper: CommentMapper,
  ) {}
  
  findByReferral(reference: string): Promise<Array<ICommentReadModel>> {
    throw new Error('Method not implemented.');
  }

  findById(id: string): Promise<ICommentReadModel | null> {
    throw new Error('Method not implemented.');
  }
  
  findByreferralReference(referralReference: string): Promise<Array<ICommentReadModel>> {
    throw new Error('Method not implemented.');
  }
}
