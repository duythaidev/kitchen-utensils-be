import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, FileTypeValidator, ParseFilePipe, MaxFileSizeValidator, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

require('dotenv').config()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 9000000 }), new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),],
        fileIsRequired: false, // <-- Cho phép file optional
      })
    ) file?: Express.Multer.File,
  ) {
    if (file) {
      // console.log(file)
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
      createUserDto.avatar_url = imageUrl;
    }
    return this.usersService.create(createUserDto);
  }


  @Get()
  findAll() {
    return this.usersService.findAll();
  }


  // hoac dung @UseGuards('jwt_strategy') 
  // UseGuards se tim strategy ten la jwt_strategy tro thanh 1 strategy nhan request
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: any) {
    console.log("req.user", req.user)
    return this.usersService.findByEmail(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
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
        fileIsRequired: false, // <-- Cho phép file optional
      })
    ) file?: Express.Multer.File,
  ) {
    if (file) {
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
    }
    return this.usersService.update(+id, updateUserDto,);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('ban/:id')
  ban(@Param('id') id: string) {
    return this.usersService.ban(+id, false);
  }

  @Post('unban/:id')
  unban(@Param('id') id: string) {
    return this.usersService.ban(+id, true);
  }

}
