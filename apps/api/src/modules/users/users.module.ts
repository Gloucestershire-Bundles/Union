import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { ClerkStrategy } from '@/auth/strategies/clerk.strategy';
import { ClerkClientProvider } from '@/auth/providers/clerk-client.provider';
import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/users.service';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, ClerkStrategy, ClerkClientProvider],
})

export class UsersModule {}
