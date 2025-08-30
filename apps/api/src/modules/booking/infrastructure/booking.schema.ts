import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BookingStatus } from "@/booking/domain/models/booking-status.enum";
import { HydratedDocument, Types } from "mongoose";

export type BookingDocument = HydratedDocument<BookingEntity>;

@Schema({ timestamps: true, collection: 'bookings' })
export class BookingEntity {
  @Prop({ required: true, unique: true, index: true })
  reference: string;

  @Prop({ required: true, index: true, ref: 'Referral' })
  referralId: Types.ObjectId;

  @Prop({ required: true })
  refereeId: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Timeslot' })
  timeslotId: Types.ObjectId;

  @Prop({ type: String, enum: Object.values(BookingStatus), default: BookingStatus.PENDING })
  status: BookingStatus;

  createdAt?: Date;
  updatedAt?: Date;
}

export const BookingSchema = SchemaFactory.createForClass(BookingEntity);