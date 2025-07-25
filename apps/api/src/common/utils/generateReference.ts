import { REFERENCE_LENGTH, REFERENCE_PREFIX } from '@/common/utils/constants';

export function generateReference(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let result = '';
  for (let i = 0; i < REFERENCE_LENGTH; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `${REFERENCE_PREFIX}-${result}`;
}
