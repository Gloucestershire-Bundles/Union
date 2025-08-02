import { ReferralStatus } from '@/common/enums/referral-status.enum';
import { ReferralDetails } from '@/modules/referrals/domain/models/interfaces/referral-details.interface';
import { ICommand } from '@nestjs/cqrs';

export class UpdateReferralCommand implements ICommand {
  constructor(
    public readonly reference: string,
    public readonly newStatus: ReferralStatus,
    public readonly newDetails: ReferralDetails,
    public readonly reason?: string,
  ) {}
}
