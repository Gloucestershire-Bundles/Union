import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import {
  IReferralRepository,
  REFERRAL_REPOSITORY,
} from '../../domain/referral.repository';
import { ReferralNotFoundException } from '../../domain/referral.exception';

/**
 * @class DeleteReferralCommand
 * @implements {ICommand}
 * @description Command to initiate the permanent deletion of a referral.
 * Uses the unique business reference to identify the referral.
 */
export class DeleteReferralCommand implements ICommand {
  constructor(public readonly reference: string) {}
}

/**
 * @class DeleteReferralHandler
 * @implements {ICommandHandler<DeleteReferralCommand>}
 * @description Handles the DeleteReferralCommand by instructing the repository
 * to permanently remove a referral record.
 */
@CommandHandler(DeleteReferralCommand)
export class DeleteReferralHandler implements ICommandHandler<DeleteReferralCommand> {
  private readonly logger = new Logger(DeleteReferralHandler.name);

  constructor(
    @Inject(REFERRAL_REPOSITORY)
    private readonly referralRepository: IReferralRepository,
  ) {}

  /**
   * Executes the DeleteReferralCommand.
   * Attempts to delete the referral from the persistence layer.
   * If the referral is not found, it throws a ReferralNotFoundException.
   * @param command The DeleteReferralCommand containing the referral's reference.
   * @returns A Promise that resolves to void upon successful deletion.
   * @throws {ReferralNotFoundException} If the referral to be deleted is not found.
   * @throws {Error} For any other unexpected database or system errors.
   */
  async execute(command: DeleteReferralCommand): Promise<void> {
    const { reference } = command;

    this.logger.debug(
      `[${DeleteReferralHandler.name}] Attempting to delete referral: ${reference}.`,
    );

    const isDeleted = await this.referralRepository.delete(reference);
    if (isDeleted) throw new ReferralNotFoundException(reference);

    this.logger.log(
      `[${DeleteReferralHandler.name}] Referral with reference ${reference} successfully deleted.`,
    );
  }
}
