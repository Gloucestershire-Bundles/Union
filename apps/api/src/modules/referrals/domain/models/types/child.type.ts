import { Gender } from '@/referrals/domain/models/enums/gender.enum';
import { Item } from '@/referrals/domain/models/interfaces/item.interface';
import { Clothing } from '@/referrals/domain/models/types/clothing.type';

export type Child = {
  forename: string;
  surname: string;
  dob: string;
  gender: Gender;
  items: Array<Item>;
  clothing: Array<Clothing>;
  notes?: string;
};
