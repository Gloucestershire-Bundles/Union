import { ICommand } from '@nestjs/cqrs';
import { ReferralDetails } from '@/referrals/models/interfaces/referral-details.interface';

export class CreateReferralCommand implements ICommand {
  constructor(
    public readonly reference: string,
    public readonly refereeId: string,
    public readonly details: ReferralDetails,
  ) {}
}