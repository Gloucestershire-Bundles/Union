import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ReferralDetailsDto } from '@/modules/referrals/application/dtos/lib/referral-details.dto';
import { ApiProperty } from '@nestjs/swagger';
import { referralDocs } from '@/common/swagger/referral.swagger';

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
