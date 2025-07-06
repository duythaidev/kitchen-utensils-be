import { CanActivate, ExecutionContext, SetMetadata, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UsersService } from "src/modules/users/users.service";

export enum UserRole {
    Admin = 'admin',
    User = 'user',
}

export class UserRolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private userService: UsersService
    ) {}

    async canActivate(context: ExecutionContext) {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
          return true;
        }

        // lay user tu req
        const { user } = context.switchToHttp().getRequest();
        const userData = await this.userService.findOne(user.id);

        if (!userData) {
            throw new UnauthorizedException('User not found');
        }

        return requiredRoles.some((role) => userData.role === role);
      }
}

export const ROLES_KEY = 'UserRoles';

// custom decorator
export const UserRoles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);