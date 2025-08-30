import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type TimeslotDocument = HydratedDocument<TimeslotEntity>;

@Schema({ timestamps: true, collection: 'timeslots' })
export class TimeslotEntity {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true, default: true })
  isAvailable: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const TimeslotSchema = SchemaFactory.createForClass(TimeslotEntity);