import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReferralCreatedEvent } from './referral-created.event';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationsService } from '@/notifications/notifications.service';
import { UsersService } from '@/users/users.service';
import { Role } from '@/common/enums/role.enum';

@EventsHandler(ReferralCreatedEvent)
@Injectable()
export class ReferralCreatedEventHandler
  implements IEventHandler<ReferralCreatedEvent>
{
  private readonly logger = new Logger(ReferralCreatedEventHandler.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async handle(event: ReferralCreatedEvent): Promise<void> {
    this.logger.log('Created event fired.');

    const referee = await this.usersService.findOne(event.refereeId);

    if (!referee) {
      this.logger.error(`Referee with ID "${event.refereeId}" not found.`,);
      return;
    }

    await this.notificationsService.sendEmail(
      referee.emailAddresses[0].emailAddress,
      `[${event.reference}] Thank you for submitting a Referral`,
      'referralCreated',
      {
        name: referee.firstName || undefined,
        referral: {
          reference: event.reference,
          status: event.status,
          details: event.details,
        },
      },
    );

    await this.notificationsService.create({
      title: 'Referral Submitted',
      recipient: event.refereeId,
      description: `A new Referral ${event.reference} has been created.`,
      link: `${process.env.PUBLIC_APP_URL}/referral/${event.reference}`,
    });

    const volunteers = await this.usersService.findAllByRole(Role.VOLUNTEER);

    const volunteerNotification = {
      title: 'Referral Submitted',
      description: `A new Referral ${event.reference} has been created.`,
      link: `${process.env.PRIVATE_APP_URL}/referral/${event.reference}`,
    };

    const createVolunteerNotifications = volunteers.map((volunteer) => ({
      ...volunteerNotification,
      recipient: volunteer.id,
    }));

    await this.notificationsService.createMany(createVolunteerNotifications);

    // TODO: Generate Referral PDF
    // TODO: Audit Module
  }
}
