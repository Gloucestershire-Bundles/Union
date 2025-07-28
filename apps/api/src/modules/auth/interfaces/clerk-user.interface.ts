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
  namespace Express {
    interface Request {
      user?: ClerkUser;
    }
  }
}
