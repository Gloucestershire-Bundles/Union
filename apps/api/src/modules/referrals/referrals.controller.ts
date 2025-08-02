import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateReferralDto } from '@/referrals/application/dtos/create-referral.dto';
import { generateReference } from '@/common/utils/generateReference';
import { CreateReferralCommand } from '@/referrals/application/commands/create/create-referral.command';
import { IReferralReadModel } from '@/referrals/domain/read-model/referral-read-model.interface';
import { GetReferralByReferenceQuery } from '@/referrals/application/queries/get-by-reference/get-referral-by-reference.query';
import { GetReferralsByRefereeQuery } from '@/referrals/application/queries/get-by-referee/get-referrals-by-referee.query';
import { GetReferralsQuery } from '@/referrals/application/queries/get-all/get-referrals.query';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';
import { UpdateReferralDto } from '@/referrals/application/dtos/update-referral.dto';
import { DeleteReferralCommand } from '@/referrals/application/commands/delete/delete-referral.command';
import { ReferralNotFoundException } from '@/referrals/domain/referral.exception';
import { UpdateReferralCommand } from './application/commands/update/update-referral.command';

@Controller('/v1/referrals')
export class ReferralsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Handles the POST /v1/referrals endpoint to create a new referral.
   * @param createReferralDto The data for the new referral.
   * @returns A Promise that resolves with details of the created referral.
   * @throws {ConflictException} If a referral with the same reference already exists.
   * @throws {InternalServerErrorException} For any other unexpected errors.
   */
  @Post()
  @Roles(Role.USER, Role.VOLUNTEER, Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createReferralDto: CreateReferralDto) {
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
      if (error instanceof ConflictException) throw error;
      throw error;
    }
  }

  /**
   * Handles GET /v1/referrals/reference/:reference endpoint to retrieve a single referral.
   * @param reference The unique business reference of the referral to retrieve.
   * @returns A Promise that resolves with the IReferralReadModel.
   * @throws {NotFoundException} If the referral with the given reference is not found.
   */
  @Get('/reference/:reference')
  @Roles(Role.USER, Role.VOLUNTEER, Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  async getReferralByReference(
    @Param('reference') reference: string,
  ): Promise<IReferralReadModel> {
    const query = new GetReferralByReferenceQuery(reference);
    try {
      const referral = await this.queryBus.execute(query);
      return referral;
    } catch (error) {
      if (error instanceof ReferralNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  /**
   * Handles GET /v1/referrals/referee/:refereeId endpoint to retrieve referrals by referee ID.
   * @param refereeId The ID of the referee.
   * @returns A Promise that resolves with an array of IReferralReadModel.
   * Returns an empty array if no referrals are found for the given referee ID.
   */
  @Get('/referee/:refereeId')
  @Roles(Role.USER, Role.VOLUNTEER, Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  async getReferralsByRefereeId(
    @Param('refereeId') refereeId: string,
  ): Promise<Array<IReferralReadModel>> {
    const query = new GetReferralsByRefereeQuery(refereeId);
    const referrals = await this.queryBus.execute(query);
    return referrals;
  }

  /**
   * Handles GET /v1/referrals endpoint to retrieve all referrals.
   * @returns A Promise that resolves with an array of all IReferralReadModel.
   * Returns an empty array if no referrals exist in the system.
   */
  @Get()
  @Roles(Role.VOLUNTEER, Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  async getReferrals(): Promise<Array<IReferralReadModel>> {
    const query = new GetReferralsQuery();
    const referrals = await this.queryBus.execute(query);
    return referrals;
  }

  @Patch(':reference')
  @Roles(Role.VOLUNTEER, Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  async edit(
    @Param('reference') reference: string,
    @Body() updateReferralDto: UpdateReferralDto,
  ) {
    // edit referral logic
  }

  /**
   * Handles PATCH /v1/referrals/:reference to update the status of a referral.
   * This is a partial update for the referral resource.
   * @param reference The unique business reference of the referral to update.
   * @param updateReferralDto The DTO containing the new status and optional reason.
   * @returns A success message.
   * @throws {NotFoundException} If the referral is not found.
   * @throws {ConflictException} If the status transition is invalid according to business rules.
   */
  @Patch(':reference')
  @Roles(Role.VOLUNTEER, Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  async updateReferralStatus(
    @Param('reference') reference: string,
    @Body() updateReferralDto: UpdateReferralDto,
  ) {
    const command = new UpdateReferralCommand(
      reference,
      updateReferralDto.status,
      updateReferralDto.details,
      updateReferralDto.reason,
    );

    try {
      await this.commandBus.execute(command);
      return {
        message: `Referral ${reference} status updated to ${updateReferralDto.status}.`,
      };
    } catch (error) {
      if (error instanceof ReferralNotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof ConflictException) {
        throw error;
      }
      throw error;
    }
  }

  /**
   * Handles the DELETE /v1/referrals/:reference endpoint to permanently delete a referral.
   * @param reference The unique business reference of the referral to delete.
   * @returns A success message if the referral is deleted.
   * @throws {NotFoundException} If the referral with the given reference is not found.
   * @throws {InternalServerErrorException} For any unexpected errors during deletion.
   */
  @Delete(':reference')
  @Roles(Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('reference') reference: string) {
    const command = new DeleteReferralCommand(reference);
    try {
      await this.commandBus.execute(command);
      return;
    } catch (error) {
      if (error instanceof ReferralNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  // @Post(':reference/withdraw')
  // @Roles(Role.USER, Role.VOLUNTEER, Role.ADMINISTRATOR)
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async withdraw() {

  // }

  // @Post('/archive')
  // @Roles(Role.VOLUNTEER, Role.ADMINISTRATOR)
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async archive() {

  // }
}
