import { ClerkClient, User } from '@clerk/backend';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @Inject('ClerkClient')
    private readonly clerkClient: ClerkClient,
  ) {}

  async findOne(id: string): Promise<User | null> {
    return this.clerkClient.users.getUser(id);
  }
}
