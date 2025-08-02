import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateReferralDto } from '@/referrals/application/dtos/create-referral.dto';
import { IsEnum, IsObject, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ReferralDetailsDto } from '@/modules/referrals/application/dtos/lib/referral-details.dto';
import { referralDocs } from '@/common/swagger/referral.swagger';
import { ReferralStatus } from '@/common/enums/referral-status.enum';

/**
 * @class UpdateReferralDto
 * @description Data Transfer Object for updating a referral.
 * Defines the expected input structure for the update referral API endpoint.
 */
export class UpdateReferralDto extends PartialType(CreateReferralDto) {
  @ApiPropertyOptional({
    description: referralDocs.description.referralStatus,
    example: referralDocs.example.status,
    enum: ReferralStatus,
  })
  @IsOptional()
  @IsEnum(ReferralStatus, { message: 'Invalid referral status provided.' })
  status?: ReferralStatus;

  @ApiPropertyOptional({
    description: referralDocs.description.referralDetails,
    example: referralDocs.example.details,
    type: ReferralDetailsDto,
  })
  @IsOptional()
  @IsObject({ message: 'Details must be an object.' })
  @ValidateNested()
  @Type(() => ReferralDetailsDto)
  details?: ReferralDetailsDto;

  @ApiProperty({
    description: 'Optional reason for the status change (e.g., withdrawal or archive).',
    example: 'No longer needed.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
