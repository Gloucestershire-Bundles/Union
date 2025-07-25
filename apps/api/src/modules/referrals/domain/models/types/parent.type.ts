import { Gender } from '@/referrals/domain/models/enums/gender.enum';
import { Pack } from '@/referrals/domain/models/enums/pack.enum';
import { Clothing } from '@/referrals/domain/models/types/clothing.type';

export type Parent = {
  forename: string;
  surname: string;
  dob: string;
  gender: Gender;
  clothing: Array<Clothing>;
  packs: Array<Pack>;
};
