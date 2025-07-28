import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '@/common/enums/role.enum';
import { ROLES_KEY } from '@/common/decorators/roles.decorator';
import { ClerkUser } from '@/auth/interfaces/clerk-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user) throw new ForbiddenException('User not authenticated.');

    const clerkUser = user as ClerkUser;

    const userRoles: Role[] = [];
    if (
      clerkUser.publicMetadata &&
      typeof clerkUser.publicMetadata.role === 'string'
    ) {
      userRoles.push(clerkUser.publicMetadata.role as Role);
    }

    const hasRequiredRole = requiredRoles.some((role) =>
      userRoles.includes(role),
    );

    if (!hasRequiredRole)
      throw new ForbiddenException(
        'You do not have the necessary permissions.',
      );

    return true;
  }
}
