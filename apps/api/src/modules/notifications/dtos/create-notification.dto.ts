import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Title of the notification.',
    example: 'New Referral Created',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Unique identifier of the recipient.',
    example: 'user_213eosads4342381dssa',
  })
  @IsNotEmpty()
  @IsString()
  recipientId: string;

  @ApiProperty({
    description: 'Type of notification.',
    example: 'referral_created',
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Detailed description of the notification.',
    example: 'A new referral has been created and requires your attention.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Optional link related to the notification.',
    example: 'https://app.example.com/referrals/REF-123456',
  })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional({
    description: 'Whether the notification has been read.',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
