import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  // async signIn(email: string, pass: string): Promise<any> {
  //   const user = await this.usersService.findByEmail(email);
  //   if (user?.password !== pass) {
  //     throw new UnauthorizedException({ message: 'Email or password is incorrect' });
  //   }
  //   const payload = { id: user.id, email: user.email };
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //     user: {
  //       id: user.id,
  //       user_name: user.user_name
  //     }
  //   };
  // }
  async signJWT(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return this.jwtService.sign(payload);
  }
  
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    return this.usersService.create(createUserDto);
  }
}