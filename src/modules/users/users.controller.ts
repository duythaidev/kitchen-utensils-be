import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, FileTypeValidator, ParseFilePipe, MaxFileSizeValidator, UseGuards, Req, Query, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilterUserDto } from './dto/filter-user.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
require('dotenv').config()
import { Roles, UserRole } from 'src/decorators/roles.decorator';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Roles(UserRole.Admin)
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
  @Roles(UserRole.Admin)
  findAll(@Query() filterDto: FilterUserDto) {
    return this.usersService.getFilteredUsers(filterDto);
  }


  // hoac dung @UseGuards('jwt_strategy') 
  // UseGuards se tim strategy ten la jwt_strategy tro thanh 1 strategy nhan request

  @Get('me')
  getProfile(@Req() req: any) {
    return this.usersService.findByEmail(req.user.email);
  }


  @Get(':id')
  @Roles(UserRole.Admin)
  findOne(@Param('id') id: string) {
    console.log(id)
    return this.usersService.findOne(+id);
  }


  @Patch(':id')
  @Roles(UserRole.Admin)
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

  @Patch('change-password/')
  @Roles(UserRole.Admin)
  changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }
    return this.usersService.changePassword(+id, changePasswordDto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('ban/:id')
  @Roles(UserRole.Admin)
  ban(@Param('id') id: string) {
    return this.usersService.ban(+id, false);
  }

  @Post('unban/:id')
  @Roles(UserRole.Admin)
  unban(@Param('id') id: string) {
    return this.usersService.ban(+id, true);
  }

}
