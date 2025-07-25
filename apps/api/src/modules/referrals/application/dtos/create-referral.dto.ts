import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ReferralDetailsDto } from '@/referrals/application/dtos/shared/referral-details.dto';
import { ApiProperty } from '@nestjs/swagger';
import { referralDocs } from '@/referrals/application/dtos/swagger/referral.docs';

export class CreateReferralDto {
  @ApiProperty({
    description: referralDocs.description.refereeId,
    example: referralDocs.example.refereeId,
  })
  @IsNotEmpty()
  @IsString()
  refereeId: string;

  @ApiProperty({
    description: referralDocs.description.referralDetails,
    example: referralDocs.example.details,
  })
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ReferralDetailsDto)
  details: ReferralDetailsDto;
}
