import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { referralDocs } from '@/common/swagger/referral.swagger';
import { Item } from '@/referrals/domain/models/interfaces/item.interface';

export class ItemDto implements Item {
  @ApiProperty({
    description: referralDocs.description.item.item,
    example: referralDocs.example.details.children[0].items[0].item,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  item: string;

  @ApiProperty({
    description: referralDocs.description.item.required,
    example: referralDocs.example.details.children[0].items[0].required,
    type: Boolean,
  })
  @IsBoolean()
  required: boolean;

  @ApiPropertyOptional({
    description: referralDocs.description.item.quantity,
    example: referralDocs.example.details.children[0].items[0].quantity,
    type: Number,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({
    description: referralDocs.description.item.notes,
    example: referralDocs.example.details.children[0].items[0].notes,
    type: String,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
