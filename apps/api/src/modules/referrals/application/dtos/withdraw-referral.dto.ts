import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * @class WithdrawReferralDto
 * @description Data Transfer Object for withdrawing a referral.
 * Defines the expected input structure for the withdraw referral API endpoint.
 */
export class WithdrawReferralDto {
  @ApiProperty({
    description: 'Optional reason for withdrawing the referral.',
    example: 'Referral was a duplicate.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Reason must be a string.' })
  @MaxLength(500)
  reason?: string;
}
