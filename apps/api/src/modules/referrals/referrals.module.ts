import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ReferralEntity,
  ReferralSchema,
} from '@/modules/referrals/infrastructure/referral.schema';
import { CqrsModule } from '@nestjs/cqrs';
import { ReferralsController } from '@/referrals/referrals.controller';
import { CreateReferralHandler } from '@/modules/referrals/application/commands/create/create-referral.command';
import { REFERRAL_REPOSITORY } from '@/referrals/domain/referral.repository';
import {
  ReferralDatabaseRepository,
  ReferralReadModelDatabaseRepository,
} from '@/modules/referrals/infrastructure/referral.database-repository';
import { GetReferralsByRefereeHandler } from './application/queries/get-by-referee/get-referrals-by-referee.query';
import { GetReferralByReferenceHandler } from './application/queries/get-by-reference/get-referral-by-reference.query';
import { GetReferralsHandler } from './application/queries/get-all/get-referrals.query';
import { DeleteReferralHandler } from './application/commands/delete/delete-referral.command';
import { ReferralMapper } from './application/referral.mapper';
import { REFERRAL_READ_MODEL_REPOSITORY } from './domain/read-model/referral-read-model.repository';

const CommandHandlers = [CreateReferralHandler, DeleteReferralHandler];
const QueryHandlers = [
  GetReferralsByRefereeHandler,
  GetReferralByReferenceHandler,
  GetReferralsHandler,
];
const EventHandlers = [];

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
    ...QueryHandlers,
    ...EventHandlers,
    { 
      provide: REFERRAL_REPOSITORY, 
      useClass: ReferralDatabaseRepository 
    },
    {
      provide: REFERRAL_READ_MODEL_REPOSITORY,
      useClass: ReferralReadModelDatabaseRepository,
    },
    ReferralMapper,
  ],
})
export class ReferralsModule {}
