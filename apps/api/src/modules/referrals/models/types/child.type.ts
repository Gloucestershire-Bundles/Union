import { Gender } from '@/referrals/models/enums/gender.enum';
import { Item } from '@/referrals/models/interfaces/item.interface';
import { Clothing } from '@/referrals/models/types/clothing.type';

export type Child = {
  forename: string;
  surname: string;
  dob: string;
  gender: Gender;
  items: Array<Item>;
  clothing: Array<Clothing>;
  notes?: string;
};
