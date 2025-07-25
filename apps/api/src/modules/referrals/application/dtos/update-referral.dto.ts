import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateReferralDto } from '@/referrals/application/dtos/create-referral.dto';
import { IsEnum, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ReferralDetailsDto } from '@/modules/referrals/application/dtos/lib/referral-details.dto';
import { referralDocs } from '@/common/swagger/referral.swagger';
import { ReferralStatus } from '@/common/enums/referral-status.enum';

export class UpdateReferralDto extends PartialType(CreateReferralDto) {
  @ApiPropertyOptional({
    description: referralDocs.description.referralStatus,
    example: referralDocs.example.status,
    enum: ReferralStatus,
  })
  @IsOptional()
  @IsEnum(ReferralStatus)
  status?: ReferralStatus;

  @ApiPropertyOptional({ 
    description: referralDocs.description.referralDetails,
    example: referralDocs.example.details,
    type: ReferralDetailsDto,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ReferralDetailsDto)
  details?: ReferralDetailsDto;
}
