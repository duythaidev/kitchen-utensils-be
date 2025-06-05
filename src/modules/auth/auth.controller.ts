import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  signIn(@Body() signInDto: Record<string, any>, @Res({ passthrough: true }) response: Response) {
    console.log(signInDto)

    const { email, password } = signInDto
    response.cookie('access-token', 'value')

    return this.authService.signIn(email, password);
  }
}
