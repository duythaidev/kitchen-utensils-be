import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly httpService: HttpService,
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
    // if (user && user.avatar) {
    //   const buffer = Buffer.from(user.avatar.buffer);
    //   const base64String = buffer.toString('base64');
    //   return {
    //     id: user.id,
    //     email: user.email,
    //     is_active: user.is_active,
    //     avatar: base64String
    //   }
    // }
    return user
  }
  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }


  async update(id: number, updateUserDto: UpdateUserDto) {
    // const data = await this.httpService.get('http://localhost:8080/api/v1/products/')
    // const { data } = await firstValueFrom(
    //   this.httpService.get('http://localhost:8080/api/v1/products/').pipe(
    //     catchError((error: AxiosError) => {
    //       this.logger.error(error?.response?.data);
    //       throw 'An error happened!';
    //     }),
    //   ),
    // );
    // console.log(data)

    // const res = await axios.get('http://localhost:8080/api/v1/products')
    // console.log(res.data)
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