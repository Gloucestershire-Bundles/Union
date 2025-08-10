import { Role } from '@/common/enums/role.enum';
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

  async findAllByRole(role: Role): Promise<Array<User>> {
    try {
      const clerkUsers = await this.clerkClient.users.getUserList();

      const filteredUsers = clerkUsers.data.filter((user) => {
        const userRole = user.publicMetadata?.role;
        return userRole === role;
      });

      const users: Array<User> = filteredUsers.map((user) => {
        return user as User;
      });

      return users;
    } catch (error) {
      console.error('Error fetching users from Clerk:', error);
      return [];
    }
  }
}
