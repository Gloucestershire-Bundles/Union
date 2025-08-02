import { AggregateRoot } from '@nestjs/cqrs';
import { ReferralStatus } from '@/common/enums/referral-status.enum';
import { ReferralDetails } from '@/referrals/domain/models/interfaces/referral-details.interface';
import { ReferralCreatedEvent } from '@/referrals/application/events/created/referral-created.event';
import { ReferralWithdrawnEvent } from '@/referrals/application/events/withdrawn/referral-withdrawn.event';
import { ReferralArchivedEvent } from '@/referrals/application/events/archived/referral-archived.event';
import { ReferralAcceptedEvent } from '@/referrals/application/events/accepted/referral-accepted.event';
import { ReferralCollectedEvent } from '@/referrals/application/events/collected/referral-collected.event';
import { ReferralNotCollectedEvent } from '@/referrals/application/events/not-collected/referral-not-collected.event';
import { ReferralRejectedEvent } from '@/referrals/application/events/rejected/referral-rejected.event';
import { ReferralInProgressEvent } from '@/referrals/application/events/in-progress/referral-in-progress.event';
import { ReferralReadyEvent } from '@/referrals/application/events/ready/referral-ready.event';

export interface ReferralProps {
  reference: string;
  refereeId: string;
  details: ReferralDetails;
  status: ReferralStatus;
  withdrawnAt?: Date;
  archivedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Referral extends AggregateRoot implements ReferralProps {
  reference: string;
  refereeId: string;
  details: ReferralDetails;
  status: ReferralStatus;
  withdrawnAt?: Date;
  archivedAt?: Date;
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
      archivedAt: undefined,
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

  /**
   * Updates the status of the referral to a new state.
   * Encapsulates business rules for status transitions and applies relevant domain events.
   *
   * @param newStatus The new status to set for the referral.
   * @param reason An optional reason for the status change (e.g., for withdrawal or archive).
   * @throws {Error} If the status transition is invalid according to business rules.
   */
  updateStatus(newStatus: ReferralStatus, reason?: string): void {
    if (this.status === newStatus) {
      return;
    }

    const oldStatus = this.status;

    switch (newStatus) {
      case ReferralStatus.ARCHIVED:
        this.status = ReferralStatus.ARCHIVED;
        this.archivedAt = new Date();
        this.apply(new ReferralArchivedEvent(this.reference, reason, this.archivedAt));
        break;

      case ReferralStatus.WITHDRAWN:
        if (this.status === ReferralStatus.ARCHIVED) {
          throw new Error(`Referral ${this.reference} cannot be withdrawn from its current status: ${this.status}.`);
        }

        this.status = ReferralStatus.WITHDRAWN;
        this.withdrawnAt = new Date();
        this.apply(new ReferralWithdrawnEvent(this.reference, reason, this.withdrawnAt));
        break;

      case ReferralStatus.NOT_COLLECTED:
        if (this.status !== ReferralStatus.READY) {
          throw new Error(`Referral ${this.reference} is not yet ready for collection.`);
        }

        this.status = ReferralStatus.NOT_COLLECTED;
        this.apply(new ReferralNotCollectedEvent(this.reference, reason));
        break;

      case ReferralStatus.COLLECTED:
        if (this.status !== ReferralStatus.READY) {
          throw new Error(`Referral ${this.reference} is not yet ready for collection.`);
        }

        this.status = ReferralStatus.COLLECTED;
        this.apply(new ReferralCollectedEvent(this.reference));
        break;

      case ReferralStatus.READY:
        if (
          this.status !== ReferralStatus.IN_PROGRESS &&
          this.status !== ReferralStatus.ACCEPTED
        ) {
          throw new Error(`Referral ${this.reference} cannot be set to "Ready" from ${this.status}. It must first be In Progress or Accepted.`);
        }

        this.status = ReferralStatus.READY;
        this.apply(new ReferralReadyEvent(this.reference));
        break;

      case ReferralStatus.IN_PROGRESS:
        if (this.status !== ReferralStatus.ACCEPTED) {
          throw new Error(`Referral ${this.reference} cannot be "In Progress" without first being accepted.`);
        }

        this.status = ReferralStatus.IN_PROGRESS;
        this.apply(new ReferralInProgressEvent(this.reference));
        break;

      case ReferralStatus.REJECTED:
        if (
          this.status !== ReferralStatus.REVIEW &&
          this.status !== ReferralStatus.ACCEPTED
        ) {
          throw new Error(`Referral ${this.reference} cannot be rejected from status ${this.status}.`);
        }

        this.status = ReferralStatus.REJECTED;
        this.apply(new ReferralRejectedEvent(this.reference, reason));
        break;

      case ReferralStatus.ACCEPTED:
        if (this.status !== ReferralStatus.REVIEW) {
          throw new Error(`Referral ${this.reference} cannot be accepted from status ${this.status}.`);
        }

        this.status = ReferralStatus.ACCEPTED;
        this.apply(new ReferralAcceptedEvent(this.reference));
        break;

      case ReferralStatus.REVIEW:
        if (oldStatus !== ReferralStatus.REVIEW) {
          throw new Error(`Referral ${this.reference} cannot revert to "Review" status from ${oldStatus}.`);
        }

        break;

      default:
        throw new Error(`Unsupported status transition from ${this.status} to ${newStatus} for referral ${this.reference}.`);
    }

    this.updatedAt = new Date();
  }

  /**
   * Updates the mutable details of the referral.
   * This method applies changes to the `details` value object.
   *
   * @param newDetails The new details to apply to the referral.
   * @throws {Error} If the referral's current status disallows details updates.
   */
  updateDetails(newDetails: ReferralDetails): void {
    if (this.status === ReferralStatus.ARCHIVED || this.status === ReferralStatus.WITHDRAWN) {
      throw new Error(`Referral ${this.reference} details cannot be updated when in status ${this.status}.`);
    }

    if (JSON.stringify(this.details) === JSON.stringify(newDetails)) {
        return;
    }

    this.details = newDetails;
    this.updatedAt = new Date();
  }
}
