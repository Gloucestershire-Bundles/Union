import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * @class ArchiveReferralDto
 * @description Data Transfer Object for archiving a referral.
 * Defines the expected input structure for the archive referral API endpoint.
 */
export class ArchiveReferralDto {
  @ApiProperty({
    description: 'Optional reason for archiving the referral.',
    example: 'Referral has been inactive for too long.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Reason must be a string.' })
  @MaxLength(500)
  reason?: string;
}
