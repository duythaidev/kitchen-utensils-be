import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, FileTypeValidator, ParseFilePipe, MaxFileSizeValidator, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import { AuthGuard } from '../auth/auth.guard';

require('dotenv').config()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }


  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id)
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 9000000 }), new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),],
      })) file: Express.Multer.File
  ) {
    // updateUserDto.avatar = file.buffer
    // console.log(process.env.Name)
    const base64 = file.buffer.toString('base64');

    const formData = new URLSearchParams();
    formData.append('key', process.env.IMGBB_AVATAR_API_KEY || '');
    formData.append('image', base64);

    const res = await axios.post('https://api.imgbb.com/1/upload', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const imageUrl = res.data.data.url;
    updateUserDto.avatar_url = imageUrl;
    return this.usersService.update(+id, updateUserDto,);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Delete()
  ban(@Body('id') id: string) {
    return this.usersService.ban(+id, true);
  }

}
