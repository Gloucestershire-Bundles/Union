import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Gender } from '@/referrals/models/enums/gender.enum';
import { Parent } from '@/referrals/models/types/parent.type';
import { ClothingDto } from '@/referrals/application/dtos/shared/clothing.dto';
import { Pack } from '@/referrals/models/enums/pack.enum';
import { ApiProperty } from '@nestjs/swagger';
import { referralDocs } from '@/referrals/application/dtos/swagger/referral.docs';

export class ParentDto implements Parent {
  @ApiProperty({
    description: referralDocs.description.parent.forename,
    example: referralDocs.example.details.parents[0].forename,
  })
  @IsNotEmpty()
  @IsString()
  forename: string;

  @ApiProperty({
    description: referralDocs.description.parent.surname,
    example: referralDocs.example.details.parents[0].surname,
  })
  @IsNotEmpty()
  @IsString()
  surname: string;

  @ApiProperty({
    description: referralDocs.description.parent.dob,
    example: referralDocs.example.details.parents[0].dob,
  })
  @IsNotEmpty()
  @IsString()
  dob: string;

  @ApiProperty({
    description: referralDocs.description.parent.gender,
    example: referralDocs.example.details.parents[0].gender,
    enum: Gender,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: referralDocs.description.parent.clothing,
    example: referralDocs.example.details.parents[0].clothing,
    type: [ClothingDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClothingDto)
  clothing: Array<ClothingDto>;

  @ApiProperty({
    description: referralDocs.description.parent.packs,
    example: referralDocs.example.details.parents[0].packs,
    type: [String],
    enum: Pack,
  })
  @IsArray()
  @IsEnum(Pack, { each: true })
  packs: Array<Pack>;
}
