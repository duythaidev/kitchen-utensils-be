import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, FileTypeValidator, ParseFilePipe, MaxFileSizeValidator } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 9000000 }), new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),],
      })) file: Express.Multer.File
  ) {
    updateUserDto.avatar = file.buffer
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
