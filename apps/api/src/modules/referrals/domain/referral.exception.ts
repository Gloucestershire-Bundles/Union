import { NotFoundException } from '@nestjs/common';

/**
 * Exception for when a Referral cannot be found.
 */
export class ReferralNotFoundException extends NotFoundException {
  constructor(reference: string) {
    super(`Referral with reference ${reference} not found.`);
  }
}
