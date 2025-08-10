import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Title of the notification.',
    example: 'New Notification',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Unique identifier of the recipient.',
    example: '213eosads4342381dssa',
  })
  @IsNotEmpty()
  @IsString()
  recipient: string;

  @ApiProperty({
    description: 'Private description of the notification.',
    example: 'This is a new notification.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Link for the notification.',
    example: 'https://example.com/product/434ee31235dadd352e',
  })
  @IsString()
  link?: string;
}
