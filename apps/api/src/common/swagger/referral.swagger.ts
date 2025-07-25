import { Gender } from '@/referrals/domain/models/enums/gender.enum';
import { Pack } from '@/referrals/domain/models/enums/pack.enum';
import { ReferralStatus } from '@/common/enums/referral-status.enum';

export const referralDocs = {
  description: {
    refereeId:
      'ID of the referee (e.g., social worker, charity staff) making the referral.',
    referralDetails:
      'Information about the referral, including family members and requested items.',
    referralStatus: 'The current status of the referral.',
    parents: 'Array of parents associated with the referral.',
    parent: {
      forename: 'Forename of the parent.',
      surname: 'Surname of the parent.',
      dob: 'Date of birth of the parent (ISO 8601 string).',
      gender: 'Gender of the parent.',
      clothing: 'List of clothing items requested for the parent.',
      packs: 'List of packs requested for the parent.',
    },
    child: {
      forename: 'Forename of the child.',
      surname: 'Surname of the child.',
      dob: 'Date of birth of the child (ISO 8601 string).',
      gender: 'Gender of the child.',
      items: 'List of items requested for the child.',
      clothing: 'List of clothing items requested for the child.',
      notes: 'Additional notes about the child (e.g., allergies, special needs)',
    },
    item: {
      item: 'Name of the item.',
      required: 'Indicates if the item is required.',
      quantity: 'Quantity of the item.',
      notes: 'Additional notes for the item.',
    },
    clothing: {
      type: 'Type of clothing item (e.g., "top", "bottom")',
      size: 'The size of the clothing.',
      required: 'Indicates if the clothing is required.',
      notes: 'Additional notes for the clothing item.'
    },
    children: 'Array of children associated with the referral.',
    postcode: 'Postcode of the family receiving the referral',
    reason: 'Reason for the referral (e.g., family circumstances, specific needs).',
    isRepeatFamily: 'Indicates if this is a repeat referral for the same family.',
    file: 'File URL for a home safety report.'
  },
  example: {
    refereeId: 'aa4a3c82-3ff2-475d-b0e5-d2196520562c',
    status: ReferralStatus.REVIEW,
    details: {
      parents: [
        {
          forename: 'Jane',
          surname: 'Doe',
          dob: '1997-07-26T14:30:00Z',
          gender: Gender.FEMALE,
          clothing: [
            {
              type: 'Trousers',
              size: 'L',
              required: true,
              notes: 'I would like pink trousers please.',
            },
          ],
          packs: [Pack.MATERNITY, Pack.HOSPITAL],
        },
        {
          forename: 'John',
          surname: 'Doe',
          dob: '1533-07-26T14:30:00Z',
          gender: Gender.MALE,
          clothing: [
            {
              type: 'Trousers',
              size: 'M',
              required: true,
              notes: 'I would like black trousers please.',
            },
          ],
          packs: [Pack.ADULT],
        },
      ],
      children: [
        {
          forename: 'Billy',
          surname: 'Doe',
          dob: '2023-07-26T14:30:00Z',
          gender: Gender.MALE,
          items: [
            {
              item: 'Cotbed',
              required: true,
              quantity: 1,
              notes: 'No notes required.',
            },
          ],
          clothing: [
            {
              type: 'Top',
              size: 'Medium',
              required: true,
              notes: 'A few white t-shirts please.',
            },
          ],
          notes: 'No further notes required.',
        },
        {
          forename: 'Timothy',
          surname: 'Doe',
          dob: '2007-03-26T14:30:00Z',
          gender: Gender.MALE,
          items: [
            {
              item: 'Headphones',
              required: true,
              quantity: 1,
              notes: 'To play my PS5 with please.',
            },
          ],
          clothing: [
            {
              type: 'Trousers',
              size: 'XL',
              required: true,
              notes: 'I would like green trousers please.',
            },
          ],
          notes: 'No notes required.',
        },
      ],
      postcode: 'SW1A 0AA',
      reason: 'Urgent family support needed due to new baby.',
      isRepeatFamily: false,
      file: 'https://example.com/home_safety_report.pdf',
    },
  },
  validation: {
    atLeastOneParent: 'At least one parent is required.',
    atLeastOneChild: 'At least one child is required.'
  },
};
