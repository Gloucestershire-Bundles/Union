import { AggregateRoot } from '@nestjs/cqrs';
import { ReferralStatus } from 'src/common/enums/referral-status.enum';
import { ReferralDetails } from '@/referrals/domain/models/interfaces/referral-details.interface';
import { ReferralCreatedEvent } from '@/modules/referrals/application/events/referral-created.event';

export interface ReferralProps {
  reference: string;
  refereeId: string;
  details: ReferralDetails;
  status: ReferralStatus;
  withdrawnAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Referral extends AggregateRoot implements ReferralProps {
  reference: string;
  refereeId: string;
  details: ReferralDetails;
  status: ReferralStatus;
  withdrawnAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: ReferralProps) {
    super();
    Object.assign(this, props);
  }

  static save(
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
      createdAt: new Date(),
      updatedAt: new Date(),
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
