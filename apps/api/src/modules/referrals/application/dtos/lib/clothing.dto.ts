import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { referralDocs } from '@/common/swagger/referral.swagger';
import { Clothing } from '@/referrals/domain/models/types/clothing.type';

export class ClothingDto implements Clothing {
  @ApiProperty({
    description: referralDocs.description.clothing.type,
    example: referralDocs.example.details.children[0].clothing[0].type,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiPropertyOptional({
    description: referralDocs.description.clothing.size,
    example: referralDocs.example.details.children[0].clothing[0].size,
    type: String,
  })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({
    description: referralDocs.description.clothing.required,
    example: referralDocs.example.details.children[0].clothing[0].required,
  })
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiPropertyOptional({
    description: referralDocs.description.clothing.notes,
    example: referralDocs.example.details.children[0].clothing[0].notes,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
