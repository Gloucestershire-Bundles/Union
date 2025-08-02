import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ReferralEntity,
  ReferralSchema,
} from '@/referrals/infrastructure/referral.schema';
import { CqrsModule } from '@nestjs/cqrs';
import { ReferralsController } from '@/referrals/referrals.controller';
import { REFERRAL_REPOSITORY } from '@/referrals/domain/referral.repository';
import {
  ReferralDatabaseRepository,
  ReferralReadModelDatabaseRepository,
} from '@/referrals/infrastructure/referral.database-repository';
import { ReferralMapper } from '@/referrals/application/referral.mapper';
import { REFERRAL_READ_MODEL_REPOSITORY } from '@/referrals/domain/read-model/referral-read-model.repository';
import { ArchiveReferralHandler } from '@/referrals/application/commands/archive/archive-referral.handler';
import { UpdateReferralHandler } from '@/referrals/application/commands/update/update-referral-details.handler';
import { WithdrawReferralHandler } from '@/referrals/application/commands/withdraw/withdraw-referral.handler';
import { CreateReferralHandler } from '@/referrals/application/commands/create/create-referral.handler';
import { DeleteReferralHandler } from '@/referrals/application/commands/delete/delete-referral.handler';
import { GetReferralsByRefereeHandler } from '@/referrals/application/queries/get-by-referee/get-referrals-by-referee.handler';
import { GetReferralByReferenceHandler } from '@/referrals/application/queries/get-by-reference/get-referral-by-reference.handler';
import { GetReferralsHandler } from '@/referrals/application/queries/get-all/get-referrals.handler';

const CommandHandlers = [
  ArchiveReferralHandler,
  CreateReferralHandler, 
  DeleteReferralHandler,
  UpdateReferralHandler,
  WithdrawReferralHandler,
];
const QueryHandlers = [
  GetReferralsByRefereeHandler,
  GetReferralByReferenceHandler,
  GetReferralsHandler,
];
const EventHandlers = [
  
];

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
