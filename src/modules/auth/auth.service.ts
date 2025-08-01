import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateUserGoogleDto } from '../users/dto/create-user-google.dto';
// user local passport dang nhap tra ve jwt token
// jwt passport dung de validate token
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signJWT(user: any) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email, true);
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

    // hash password before saving
    const hashedPassword = await this.hashPassword(createUserDto.password);
    createUserDto.password = hashedPassword;

    return this.usersService.create({ ...createUserDto, auth_provider: "local" });
  }

  async findOrCreateByGoogle(createUserGoogleDto: CreateUserGoogleDto) {
    const user = await this.usersService.findByEmail(createUserGoogleDto.email);
    if (user) return user;
    return this.usersService.create({
      email: createUserGoogleDto.email,
      avatar_url: createUserGoogleDto.avatar_url,
      user_name: createUserGoogleDto.user_name,
      password: "",
      auth_provider: "google"
    });
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}