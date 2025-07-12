
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/modules/users/users.service';
import { UserRole } from 'src/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private userService: UsersService
    ) { }

    async canActivate(context: ExecutionContext) {
        const roles : UserRole[] = this.reflector.get("user_roles", context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.id;
        if (!userId) throw new ForbiddenException('User not authenticated');
        const user = await this.userService.findOne(userId);
        if (!user) throw new ForbiddenException('User not found');
        return roles.some((role) => user.role === role);
    }
}
