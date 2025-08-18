import { NotFoundException, ConflictException } from '@nestjs/common';

/**
 * Custom exception thrown when a Referral aggregate cannot be found
 * by its unique reference, typically when attempting to load it for an operation.
 * @example throw new ReferralNotFoundException(command.reference);
 */
export class ReferralNotFoundException extends NotFoundException {
  constructor(reference: string) {
    super(`Referral with reference ${reference} not found.`);
  }
}

/**
 * Custom exception thrown when a Referral already exists.
 * by its unique reference, typically when attempting to create it.
 * @example throw new ReferralAlreadyExistsException(command.reference);
 */
export class ReferralAlreadyExistsException extends ConflictException {
  constructor(reference: string) {
    super(`Referral with reference ${reference} already exists.`);
  }
}
