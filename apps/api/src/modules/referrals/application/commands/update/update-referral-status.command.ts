import { ReferralStatus } from '@/common/enums/referral-status.enum';
import { ICommand } from '@nestjs/cqrs';

export class UpdateReferralStatusCommand implements ICommand {
  constructor(
    public readonly reference: string,
    public readonly newStatus: ReferralStatus,
    public readonly reason?: string,
  ) {}
}
