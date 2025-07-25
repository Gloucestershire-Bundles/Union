import { AggregateRoot } from '@nestjs/cqrs';
import { ReferralStatus } from 'src/common/enums/referral-status.enum';
import { ReferralDetails } from '@/referrals/models/interfaces/referral-details.interface';
import { ReferralCreatedEvent } from '@/referrals/application/events/referral-created.event';

export interface ReferralProps {
  reference: string;
  refereeId: string;
  details: ReferralDetails;
  status: ReferralStatus;
  withdrawnAt?: Date;
}

export class Referral extends AggregateRoot implements ReferralProps {
  reference: string;
  refereeId: string;
  details: ReferralDetails;
  status: ReferralStatus;
  withdrawnAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: ReferralProps & { createdAt?: Date; updatedAt?: Date }) {
    super();
    Object.assign(this, props);
  }

  static create(
    reference: string,
    refereeId: string,
    details: ReferralDetails,
  ): Referral {
    const referral = new Referral({
      reference: reference,
      refereeId: refereeId,
      details: details,
      status: ReferralStatus.REVIEW,
      withdrawnAt: undefined,
    });

    referral.apply(
      new ReferralCreatedEvent(
        referral.reference,
        referral.refereeId,
        referral.details,
        referral.status,
      ),
    );
    return referral;
  }
}
