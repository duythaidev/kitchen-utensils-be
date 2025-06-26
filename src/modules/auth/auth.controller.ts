import { Controller, Post, Res, UseGuards, Req, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async signIn(@Req() req: any, @Res({ passthrough: true }) response: Response) {
    console.log(req.user)
    const token = await this.authService.signJWT(req.user)
    response.cookie('access-token', token)
    return {
      access_token: token,
      user: req.user
    };
  }

  @UseGuards(AuthGuard('local'))
  @Post('logout')
  async logout(@Request() req) {
    return req.logout();
  }
}
