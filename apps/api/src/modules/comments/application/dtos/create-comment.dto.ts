import { commentDocs } from "@/common/swagger/comment.swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDto {
  @ApiProperty({
    description: commentDocs.description.referralId,
    example: commentDocs.example.referralId,
  })
  @IsNotEmpty()
  @IsString()
  referralId: string;

  @ApiProperty({
    description: commentDocs.description.content,
    example: commentDocs.example.content,
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}