import { Gender } from '@/referrals/models/enums/gender.enum';
import { Pack } from '@/referrals/models/enums/pack.enum';
import { Clothing } from '@/referrals/models/types/clothing.type';

export type Parent = {
  forename: string;
  surname: string;
  dob: string;
  gender: Gender;
  clothing: Array<Clothing>;
  packs: Array<Pack>;
};
