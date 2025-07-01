import { Controller, Post, Res, UseGuards, Req, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async signIn(@Req() req: any, @Res({ passthrough: true }) response: Response) {
    console.log(req.user)
    const token = await this.authService.signJWT(req.user)
    return {
      access_token: token,
      user: req.user
    };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('logout')
  async logout(@Request() req) {
    return req.logout();
  }
}
