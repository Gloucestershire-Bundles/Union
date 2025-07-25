import { Injectable, Logger } from '@nestjs/common';
import { IReferralRepository } from '@/referrals/domain/referral.repository';
import { InjectModel } from '@nestjs/mongoose';
import { ReferralEntity } from '@/referrals/infrastructure/persistence/referral.schema';
import { Model } from 'mongoose';
import { Referral } from '@/referrals/domain/referral.entity';

@Injectable()
export class ReferralMongooseRepository implements IReferralRepository {
  constructor(
    @InjectModel(ReferralEntity.name)
    private referralModel: Model<ReferralEntity>,
  ) {}

  async create(referral: Referral): Promise<void> {
    const newReferral = new this.referralModel(referral);
    await newReferral.save();
    Logger.log(`[Database] Created referral with reference ${referral.reference}`);
  }
}
