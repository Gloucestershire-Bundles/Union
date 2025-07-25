import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Gender } from '@/referrals/models/enums/gender.enum';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Pack } from '@/referrals/models/enums/pack.enum';
import { ReferralStatus } from '@/common/enums/referral-status.enum';

@Schema()
class Clothing {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  required: boolean;

  @Prop()
  notes?: string;
}

export const ClothingSchema = SchemaFactory.createForClass(Clothing);

@Schema()
class Item {
  @Prop({ required: true })
  item: string;

  @Prop({ required: true })
  required: boolean;

  @Prop()
  quantity?: number;

  @Prop()
  notes?: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);

@Schema()
class Child {
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

export const ChildSchema = SchemaFactory.createForClass(Child);

@Schema()
class Parent {
  @Prop({ required: true })
  forename: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true })
  dob: Date;

  @Prop({ enum: Gender, required: true })
  gender: Gender;

  @Prop({ type: [ClothingSchema] })
  clothing: Types.DocumentArray<Clothing>;

  @Prop({ type: [String], enum: Pack })
  packs: Pack[];
}

export const ParentSchema = SchemaFactory.createForClass(Parent);

@Schema()
class ReferralDetails {
  @Prop({ required: true })
  postcode: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  isRepeatFamily: boolean;

  @Prop({ type: [ParentSchema] })
  parents: Types.DocumentArray<Parent>;

  @Prop({ type: [ChildSchema] })
  children: Types.DocumentArray<Child>;

  @Prop()
  file?: string;
}

export const ReferralDetailsSchema =
  SchemaFactory.createForClass(ReferralDetails);

@Schema({ timestamps: true, collection: 'referrals' })
export class ReferralEntity extends Document {
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
}

export const ReferralSchema = SchemaFactory.createForClass(ReferralEntity);
export type ReferralDocument = HydratedDocument<ReferralEntity>;
