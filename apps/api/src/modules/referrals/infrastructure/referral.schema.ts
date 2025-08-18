import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Gender } from '@/referrals/domain/models/enums/gender.enum';
import { HydratedDocument, Types } from 'mongoose';
import { Pack } from '@/referrals/domain/models/enums/pack.enum';
import { ReferralStatus } from '@/common/enums/referral-status.enum';
import { Clothing } from '@/referrals/domain/models/types/clothing.type';
import { Item } from '@/referrals/domain/models/interfaces/item.interface';
import { Child } from '@/referrals/domain/models/types/child.type';
import { Parent } from '@/referrals/domain/models/types/parent.type';
import { ReferralDetails } from '@/referrals/domain/models/interfaces/referral-details.interface';

@Schema({ _id: false })
class ClothingSchemaClass implements Clothing {
  @Prop({ required: true })
  type: string;

  @Prop()
  size?: string;

  @Prop()
  required?: boolean;

  @Prop()
  notes?: string;
}

export const ClothingSchema = SchemaFactory.createForClass(ClothingSchemaClass);

@Schema({ _id: false })
class ItemSchemaClass implements Item {
  @Prop({ required: true })
  item: string;

  @Prop({ required: true })
  required: boolean;

  @Prop()
  quantity?: number;

  @Prop()
  notes?: string;
}

export const ItemSchema = SchemaFactory.createForClass(ItemSchemaClass);

@Schema()
class ChildSchemaClass implements Child {
  @Prop({ required: true })
  forename: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true })
  dob: Date;

  @Prop({ enum: Gender, required: true })
  gender: Gender;

  @Prop({ type: [ItemSchema], default: [] })
  items: Types.DocumentArray<Item>;

  @Prop({ type: [ClothingSchema], default: [] })
  clothing: Types.DocumentArray<Clothing>;

  @Prop()
  notes?: string;
}

export const ChildSchema = SchemaFactory.createForClass(ChildSchemaClass);

@Schema({ _id: false })
class ParentSchemaClass implements Parent {
  @Prop({ required: true })
  forename: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true })
  dob: Date;

  @Prop({ enum: Gender, required: true })
  gender: Gender;

  @Prop({ type: [ClothingSchema], default: [] })
  clothing: Types.DocumentArray<Clothing>;

  @Prop({ type: [String], enum: Pack, default: [] })
  packs: Pack[];
}

export const ParentSchema = SchemaFactory.createForClass(ParentSchemaClass);

@Schema()
class ReferralDetailsSchemaClass implements ReferralDetails {
  @Prop({ required: true })
  postcode: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  isRepeatFamily: boolean;

  @Prop({ type: [ParentSchema], default: [] })
  parents: Types.DocumentArray<Parent>;

  @Prop({ type: [ChildSchema], default: [] })
  children: Types.DocumentArray<Child>;

  @Prop()
  file?: string;
}

export const ReferralDetailsSchema = SchemaFactory.createForClass(
  ReferralDetailsSchemaClass,
);

@Schema({ timestamps: true, collection: 'referrals' })
export class ReferralEntity {
  @Prop({ required: true, unique: true })
  reference: string;

  @Prop({ required: true })
  refereeId: string;

  @Prop({ type: ReferralDetailsSchema, required: true })
  details: ReferralDetails;

  @Prop({ type: String, enum: ReferralStatus, default: ReferralStatus.REVIEW })
  status: ReferralStatus;

  @Prop({ type: Date, default: null })
  withdrawnAt?: Date;

  @Prop({ type: Date, default: null })
  archivedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ReferralSchema = SchemaFactory.createForClass(ReferralEntity);
export type ReferralDocument = HydratedDocument<ReferralEntity>;
