import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from '@/comments/comments.service';
import { getModelToken } from '@nestjs/mongoose';
import { Comment } from '@/comments/models/comment.type';
import { CreateCommentDto } from '@/comments/dtos/create-comment.dto';

describe('CommentsService', () => {
  let service: CommentsService;

  const mockCommentsModel = {
    create: jest.fn(),
    findAllByReferral: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getModelToken(Comment.name),
          useValue: mockCommentsModel,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new Comment and return its data', async () => {
    const createCommentDto = {
      referralId: 'GB-2W8XIF',
      content: 'This is a test comment.',
    } as CreateCommentDto;

    const comment = {
      authorId: 'testAuthor',
      referralId: 'GB-2W8XIF',
      content: 'This is a test comment.',
    } as Comment;

    jest.spyOn(mockCommentsModel, 'create').mockReturnValue(comment);

    const result = await service.create(createCommentDto, comment.authorId);

    expect(mockCommentsModel.create).toHaveBeenCalled();
    expect(mockCommentsModel.create).toHaveBeenCalledWith(createCommentDto);

    expect(result).toEqual(comment);
  });

  it('should return an array of Comments by a referral', async () => {
    const comment = {
      authorId: 'testAuthor',
      referralId: 'GB-2W8XIF',
      content: 'This is a test comment.',
    } as Comment;

    const comments = [comment];
    jest
      .spyOn(mockCommentsModel, 'findAllByReferral')
      .mockReturnValue(comments);

    const result = await service.findAllByReferral(comment.referralId);

    expect(result).toEqual(comments);
    expect(mockCommentsModel.findAllByReferral).toHaveBeenCalled();
  });

  it('should return a Comment by a given ID and return its data', async () => {
    const comment = {
      _id: '82a332e321oe48210de',
      authorId: 'testAuthor',
      referralId: 'GB-2W8XIF',
      content: 'This is a test comment.',
    };

    jest.spyOn(mockCommentsModel, 'findOne').mockReturnValue(comment);

    const result = await service.findOne(comment._id);

    expect(result).toEqual(comment);
    expect(mockCommentsModel.findOne).toHaveBeenCalled();
    expect(mockCommentsModel.findOne).toHaveBeenCalledWith({
      where: { id: comment._id },
    });
  });

  it('update', () => {});

  it('should delete a Comment by a given ID', async () => {
    const comment = {
      _id: '82a332e321oe48210de',
      authorId: 'testAuthor',
      referralId: 'GB-2W8XIF',
      content: 'This is a test comment.',
    };

    jest.spyOn(mockCommentsModel, 'delete').mockReturnValue(comment);

    const result = await service.delete(comment._id);

    expect(result).toEqual(comment);
    expect(mockCommentsModel.delete).toHaveBeenCalled();
    expect(mockCommentsModel.delete).toHaveBeenCalledWith(comment._id);
  });
});
