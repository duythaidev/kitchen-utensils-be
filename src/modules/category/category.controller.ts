import { Controller, Get, Post, Body, Patch, Param, Delete, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, UploadedFile, UseInterceptors, Query, BadRequestException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import { FilterCategoryDto } from './dto/filter-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  // @UseInterceptors(FileInterceptor('avatar'))
  // async create(
  //   @Body() createUserDto: CreateUserDto,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [new MaxFileSizeValidator({ maxSize: 9000000 }), new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),],
  //       fileIsRequired: false, // <-- Cho phép file optional
  //     })
  //   ) file?: Express.Multer.File,
  // ) {
  //   if (file) {
  //     // console.log(file)
  //     const base64 = file.buffer.toString('base64');

  //     const formData = new URLSearchParams();
  //     formData.append('key', process.env.IMGBB_AVATAR_API_KEY || '');
  //     formData.append('image', base64);

  //     const res = await axios.post('https://api.imgbb.com/1/upload', formData.toString(), {
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //     });
  //     const imageUrl = res.data.data.url;
  //     createUserDto.avatar_url = imageUrl;

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5_000_000 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    if (file) {
      const base64 = file.buffer.toString('base64');

      const formData = new URLSearchParams();
      formData.append('key', process.env.IMGBB_AVATAR_API_KEY || '');
      formData.append('image', base64);

      let imageUrl = '';
      try {
        const res = await axios.post('https://api.imgbb.com/1/upload', formData.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        imageUrl = res.data.data.url;
      } catch (error) {
        console.log("error", error.message)
        throw new BadRequestException('Failed to upload image');
      }

      createCategoryDto.image_url = imageUrl;
    }

    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() filterDto: FilterCategoryDto) {
    return this.categoryService.getFilteredCategories(filterDto);
  }

  // @Get()
  // findAll() {
  //   return this.categoryService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5_000_000 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    if (file) {
      const base64 = file.buffer.toString('base64');

      const formData = new URLSearchParams();
      formData.append('key', process.env.IMGBB_AVATAR_API_KEY || '');
      formData.append('image', base64);

      const res = await axios.post(
        'https://api.imgbb.com/1/upload',
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const imageUrl = res.data.data.url;
      updateCategoryDto.image_url = imageUrl;
    }

    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
