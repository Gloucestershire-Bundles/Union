import { User } from '@clerk/backend';

export interface ClerkUser extends Pick<User, 'id' | 'emailAddresses'> {
  publicMetadata: {
    role?: string;
    [key: string]: any;
  };
  privateMetadata: {
    [key: string]: any;
  };
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: ClerkUser;
    }
  }
}
