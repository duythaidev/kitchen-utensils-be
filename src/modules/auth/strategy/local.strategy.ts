
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
// local_strategy la ten cua strategy de guard map vao
export class LocalStrategy extends PassportStrategy(Strategy, 'local_strategy') {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email', // ten thuoc tinh email trong body request
            passwordField: 'password',
        });
    }
    // truyen vao email va password tu body request
    async validate(email: string, password: string): Promise<any> {
        // hash password o day
        const hashedPassword = await this.authService.hashPassword(password);

        const user = await this.authService.validateUser(email, hashedPassword);
        if (!user) {
            throw new UnauthorizedException({ message: 'Email or password is incorrect' });
        }
        return user;
    }
}