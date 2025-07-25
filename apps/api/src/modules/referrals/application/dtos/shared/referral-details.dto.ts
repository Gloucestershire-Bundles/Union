import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ParentDto } from '@/referrals/application/dtos/shared/parent.dto';
import { Type } from 'class-transformer';
import { ChildDto } from '@/referrals/application/dtos/shared/child.dto';
import { ReferralDetails } from '@/referrals/models/interfaces/referral-details.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { referralDocs } from '@/referrals/application/dtos/swagger/referral.docs';

export class ReferralDetailsDto implements ReferralDetails {
  @ApiProperty({
    description: referralDocs.description.parents,
    example: referralDocs.example.details.parents,
    type: [ParentDto],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1, { message: referralDocs.validation.atLeastOneParent })
  @ValidateNested({ each: true })
  @Type(() => ParentDto)
  parents: Array<ParentDto>;

  @ApiProperty({
    description: referralDocs.description.children,
    example: referralDocs.example.details.children,
    type: [ChildDto],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1, { message: referralDocs.validation.atLeastOneChild })
  @ValidateNested({ each: true })
  @Type(() => ChildDto)
  children: Array<ChildDto>;

  @ApiProperty({
    description: referralDocs.description.postcode,
    example: referralDocs.example.details.postcode,
  })
  @IsNotEmpty()
  @IsString()
  postcode: string;

  @ApiProperty({
    description: referralDocs.description.reason,
    example: referralDocs.example.details.reason,
  })
  @IsNotEmpty()
  @IsString()
  reason: string;

  @ApiProperty({
    description: referralDocs.description.isRepeatFamily,
    example: referralDocs.example.details.isRepeatFamily,
  })
  @IsBoolean()
  isRepeatFamily: boolean;

  @ApiPropertyOptional({
    description: referralDocs.description.file,
    example: referralDocs.example.details.file,
  })
  @IsOptional()
  @IsString()
  file?: string;
}
