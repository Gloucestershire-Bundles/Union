import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Gender } from '@/referrals/domain/models/enums/gender.enum';
import { Child } from '@/referrals/domain/models/types/child.type';
import { ClothingDto } from '@/modules/referrals/application/dtos/lib/clothing.dto';
import { ItemDto } from '@/modules/referrals/application/dtos/lib/item.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { referralDocs } from '@/common/swagger/referral.swagger';

export class ChildDto implements Child {
  @ApiProperty({
    description: referralDocs.description.child.forename,
    example: referralDocs.example.details.children[0].forename,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  forename: string;

  @ApiProperty({
    description: referralDocs.description.child.surname,
    example: referralDocs.example.details.children[0].surname,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  surname: string;

  @ApiProperty({
    description: referralDocs.description.child.dob,
    example: referralDocs.example.details.children[0].dob,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  dob: string;

  @ApiProperty({
    description: referralDocs.description.child.gender,
    example: referralDocs.example.details.children[0].gender,
    enum: Gender,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: referralDocs.description.child.items,
    example: referralDocs.example.details.children[0].items,
    type: [ItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: Array<ItemDto>;

  @ApiProperty({
    description: referralDocs.description.child.clothing,
    example: referralDocs.example.details.children[0].clothing,
    type: [ClothingDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClothingDto)
  clothing: Array<ClothingDto>;

  @ApiPropertyOptional({
    description: referralDocs.description.child.notes,
    example: referralDocs.example.details.children[0].notes,
    type: String,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
