import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { FilterUserDto } from './dto/filter-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  private select = {
    id: true,
    email: true,
    phone: true,
    address: true,
    avatar_url: true,
    user_name: true,
    role: true,
    is_active: true,
  }

  async create(createUserDto: CreateUserDto) {
    const isExist = await this.usersRepository.findOne({ where: { email: createUserDto.email } })
    if (isExist !== null) {
      throw new BadRequestException('Email exist');
    }
    // hash password before saving
    const hashedPassword = await this.hashPassword(createUserDto.password);
    createUserDto.password = hashedPassword;

    const user = await this.usersRepository.save(createUserDto);

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      address: user.address,
      avatar_url: user.avatar_url,
      user_name: user.user_name,
      role: user.role,
    };
  }

  async getFilteredUsers(query: FilterUserDto) {
    const { keyword, page, limit } = query;

    const pageNumber = page ? parseInt(page) : 1;
    const limitNumber = limit ? parseInt(limit) : 10;

    const where: any = {};
    if (keyword) {
      where.user_name = Like(`%${keyword.toLowerCase()}%`);
    }

    const [items, total] = await this.usersRepository.findAndCount({
      where,
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      select: this.select
    });

    return {
      data: items,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  findAllWithCondition(query: any) {
    return this.usersRepository.find(query);
  }

  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException('Id is required');
    }
    const user = await this.usersRepository.findOne({
      where: { id },
      select: this.select
    });
    return user
  }

  async findByEmail(email: string, password: boolean = false) {
    return await this.usersRepository.findOne({
      where: { email },
      select: password ? // If password is true, include password in the select
        { ...this.select, password: true } :
        this.select
    });
  }

  async findByAuthProvider(auth_provider: string) {
    return await this.usersRepository.findOne({ where: { auth_provider }, select: this.select })
  }


  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const updated = { ...user, ...updateUserDto };
    const updatedUser = await this.usersRepository.save(updated);
    return {
      id: updatedUser.id,
      user_name: updatedUser.user_name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      avatar_url: updatedUser.avatar_url,
      role: updatedUser.role,
    };
  }

  async changePassword(id: number, changePasswordDto: { oldPassword: string, newPassword: string }) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const hashOldPassword = await this.hashPassword(changePasswordDto.oldPassword);
    const hashNewPassword = await this.hashPassword(changePasswordDto.newPassword);
    if (user.password !== hashOldPassword) {
      throw new BadRequestException('Old password is incorrect');
    }

    user.password = hashNewPassword;
    await this.usersRepository.save(user);
    return { message: 'Password changed successfully' };
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
    // return password;
  }

  remove(id: number) {
    return this.usersRepository.delete({ id });
  }

  ban(id: number, is_active: boolean) {
    return this.usersRepository.update({ id }, { is_active });
  }

}