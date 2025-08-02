import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ReferralDetailsDto } from '@/referrals/application/dtos/lib/referral-details.dto';
import { ApiProperty } from '@nestjs/swagger';
import { referralDocs } from '@/common/swagger/referral.swagger';

/**
 * @class CreateReferralDto
 * @description Data Transfer Object for creating a new referral.
 * Defines the expected input structure for the create referral API endpoint.
 */
export class CreateReferralDto {
  @ApiProperty({
    description: referralDocs.description.refereeId,
    example: referralDocs.example.refereeId,
  })
  @IsNotEmpty({ message: 'Referee ID cannot be empty.' })
  @IsString({ message: 'Referee ID must be a string.' })
  refereeId: string;

  @ApiProperty({
    description: referralDocs.description.referralDetails,
    example: referralDocs.example.details,
  })
  @IsObject({ message: 'Details must be an object.' })
  @IsNotEmpty({ message: 'Details cannot be empty.' })
  @ValidateNested()
  @Type(() => ReferralDetailsDto)
  details: ReferralDetailsDto;
}
