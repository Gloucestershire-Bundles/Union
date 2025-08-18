import { ReferralStatus } from '@/common/enums/referral-status.enum';
import { referralDocs } from '@/common/swagger/referral.swagger';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * @class UpdateReferralStatusDto
 * @description Data Transfer Object for updating the status of a referral.
 */
export class UpdateReferralStatusDto {
  @ApiProperty({
    description: referralDocs.description.referralStatus,
    example: referralDocs.example.status,
    enum: ReferralStatus,
  })
  @IsEnum(ReferralStatus, { message: 'Invalid referral status provided.' })
  status: ReferralStatus;

  @ApiPropertyOptional({
    description:
      'Optional reason for the status change (e.g., withdrawal or archive).',
    example: 'Referral was incorrectly accepted.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
