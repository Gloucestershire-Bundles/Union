import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateReferralDto } from './application/dtos/create-referral.dto';
import { generateReference } from 'src/common/utils/generateReference';
import { CreateReferralCommand } from './application/commands/create-referral.command';

@Controller('/v1/referrals')
export class ReferralsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReferral(@Body() createReferralDto: CreateReferralDto) {
    const reference = generateReference();
    const command = new CreateReferralCommand(
      reference,
      createReferralDto.refereeId,
      createReferralDto.details,
    );

    try {
      const referral = await this.commandBus.execute(command);
      return {
        message: 'Referral created successfully.',
        reference: referral.reference,
        createdAt: referral.createdAt,
        status: referral.status,
      };
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }
}
