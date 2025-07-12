// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export enum UserRole {
    Admin = 'admin',
    User = 'user',
}
export const Roles = (...roles: UserRole[]) => SetMetadata('user_roles', roles);


// import { Reflector } from '@nestjs/core';

// export const Roles = Reflector.createDecorator<string[]>();

