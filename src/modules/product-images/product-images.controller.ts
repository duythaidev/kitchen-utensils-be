import { Controller, Get, Post, Body, Patch, Param, Delete, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { create } from 'domain';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Controller('product-images')
export class ProductImagesController {
    constructor(private readonly productImagesService: ProductImagesService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image_url'))
    async update(@Body() createProductImageDto: CreateProductImageDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [new MaxFileSizeValidator({ maxSize: 9000000 }), new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),],
            })) file: Express.Multer.File
    ) {
        // create(@Body() createProductImageDto: CreateProductImageDto) {
        return this.productImagesService.create(createProductImageDto);
    }

    @Get()
    findAll() {
        return this.productImagesService.findAll();
    }

    @Get('product/:productId')
    findByProductId(@Param('productId') productId: string) {
        return this.productImagesService.findByProductId(+productId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productImagesService.findOne(+id);
    }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateProductImageDto: UpdateProductImageDto) {
    //     return this.productImagesService.update(+id, updateProductImageDto);
    // }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productImagesService.remove(+id);
    }
}
