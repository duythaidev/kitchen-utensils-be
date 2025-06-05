import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const isExist = await this.usersRepository.findOne({ where: { email: createUserDto.email } })
    if (isExist !== null) {
      throw new BadRequestException('Email exist');
    }
    return this.usersRepository.save(createUserDto);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user && user.avatar) {
      const buffer = Buffer.from(user.avatar.buffer);
      const base64String = buffer.toString('base64');
      return {
        id: user.id,
        email: user.email,
        is_active: user.is_active,
        avatar: base64String
      }
    }
    return user
  }
  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }


  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(
      { id },
      { ...updateUserDto }
    );
  }

  remove(id: number) {
    return this.usersRepository.delete({ id });
  }

  ban(id: number, is_active: boolean) {
    return this.usersRepository.update({ id }, { is_active });
  }

}