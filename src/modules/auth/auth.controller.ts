import { Controller, Post, Res, UseGuards, Req, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserGoogleDto } from '../users/dto/create-user-google.dto';
import { Roles, UserRole } from 'src/decorators/roles.decorator';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async signIn(@Req() req: any, @Res({ passthrough: true }) response: Response) {
    // console.log(req.user)
    const token = await this.authService.signJWT(req.user)
    return {
      access_token: token,
      user: req.user
    };
  }

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  
  @Public()
  @Post('google')
  async googleLogin(@Body() createUserGoogleDto: CreateUserGoogleDto) {
    const user = await this.authService.findOrCreateByGoogle(createUserGoogleDto);
    const token = await this.authService.signJWT(user);
    return { access_token: token, user };
  }

  // used in session
  // @UseGuards(LocalAuthGuard)
  // @Post('logout')
  // async logout(@Request() req) {
  //   return req.logout();
  // }
}
