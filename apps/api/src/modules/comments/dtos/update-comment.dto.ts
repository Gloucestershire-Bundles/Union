import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { commentDocs } from '@/common/swagger/comment.swagger';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiProperty({
    description: commentDocs.description.content,
    example: commentDocs.example.content,
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
