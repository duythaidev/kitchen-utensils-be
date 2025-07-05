
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// map guard vao jwt_strategy
// strategy la nhan request, guard la 1 variable cua strategy
export class JwtAuthGuard extends AuthGuard('jwt_strategy') { }
