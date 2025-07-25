import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ReferralEntity,
  ReferralSchema,
} from '@/referrals/infrastructure/persistence/referral.schema';
import { CqrsModule } from '@nestjs/cqrs';
import { ReferralsController } from '@/referrals/referrals.controller';
import { CreateReferralHandler } from '@/referrals/application/commands/create-referral/create-referral.handler';
import { REFERRAL_REPOSITORY } from '@/referrals/domain/referral.repository';
import { ReferralMongooseRepository } from '@/referrals/infrastructure/persistence/referral.mongoose.repository';

export const CommandHandlers = [CreateReferralHandler];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: ReferralEntity.name, schema: ReferralSchema },
    ]),
  ],
  controllers: [ReferralsController],
  providers: [
    ...CommandHandlers,
    { provide: REFERRAL_REPOSITORY, useClass: ReferralMongooseRepository },
  ],
})

export class ReferralsModule {}
