import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ClerkStrategy } from '@/auth/strategies/clerk.strategy';
import { ClerkClientProvider } from '@/auth/providers/clerk-client.provider';

@Module({
  imports: [PassportModule],
  providers: [ClerkStrategy, ClerkClientProvider],
  exports: [ClerkStrategy, ClerkClientProvider],
})
export class AuthModule {}
