
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt_strategy') {
    constructor() {
        super({
            // lay token tu header va decode
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, // token exprire return error
            secretOrKey: process.env.JWT_SECRET || 'secret',
        });
    }

    // lay payload tu token va return req.user
    async validate(payload: any) {
        return { id: payload.sub, email: payload.email };
    }
}
