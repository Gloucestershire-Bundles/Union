import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ReferralDetailsDto } from '@/referrals/application/dtos/lib/referral-details.dto';
import { referralDocs } from '@/common/swagger/referral.swagger';

/**
 * @class UpdateReferralDetailsDto
 * @description Data Transfer Object for updating a referral.
 * Defines the expected input structure for the update referral API endpoint.
 */
export class UpdateReferralDetailsDto {
  @ApiPropertyOptional({
    description: referralDocs.description.referralDetails,
    example: referralDocs.example.details,
    type: ReferralDetailsDto,
  })
  @IsOptional()
  @IsObject({ message: 'Details must be an object.' })
  @ValidateNested()
  @Type(() => ReferralDetailsDto)
  details: ReferralDetailsDto;
}
