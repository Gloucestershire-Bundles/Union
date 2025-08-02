import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { CreateReferralCommand } from "./create-referral.command";
import { ConflictException, Inject, Logger } from "@nestjs/common";
import { IReferralRepository, REFERRAL_REPOSITORY } from "@/modules/referrals/domain/referral.repository";
import { Referral } from "@/modules/referrals/domain/referral.entity";

/**
 * @class CreateReferralHandler
 * @implements {ICommandHandler<CreateReferralCommand>}
 * @description Handles the CreateReferralCommand by creating a new Referral Aggregate Root,
 * persisting its state, and publishing relevant domain events.
 */
@CommandHandler(CreateReferralCommand)
export class CreateReferralHandler
  implements ICommandHandler<CreateReferralCommand>
{
  private readonly logger = new Logger(CreateReferralHandler.name);

  constructor(
    @Inject(REFERRAL_REPOSITORY)
    private readonly referralRepository: IReferralRepository,
    private readonly publisher: EventPublisher,
  ) {}

  /**
   * Executes the CreateReferralCommand.
   * Creates a new Referral aggregate, saves it to the repository, and commits its events.
   * @param command The CreateReferralCommand containing data for the new referral.
   * @returns A Promise that resolves with the created Referral aggregate.
   * @throws {ConflictException} If a referral with the same unique reference already exists.
   * @throws {Error} For any other unexpected errors during the creation process.
   */
  async execute(command: CreateReferralCommand): Promise<Referral> {
    const { reference, refereeId, details } = command;

    this.logger.debug(`[${CreateReferralHandler.name}] Attempting to create referral: ${reference}.`);
    const referral = this.publisher.mergeObjectContext(
      Referral.save(reference, refereeId, details),
    );

    try {
      await this.referralRepository.save(referral);
    } catch (error) {
      if (error.code === 11000 && error.message.includes('reference')) {
        this.logger.warn(`[${CreateReferralHandler.name}] Referral with reference ${reference} already exists.`);
        throw new ConflictException(`Referral with reference ${reference} already exists.`);
      }
      this.logger.error(
        `[${CreateReferralHandler.name}] Failed to create referral ${reference}: ${error.message}`,
        error.stack,
      );
      throw error;
    }

    referral.commit();

    this.logger.log(`[${CreateReferralHandler.name}] Referral ${referral.reference} successfully created.`);
    return referral;
  }
}