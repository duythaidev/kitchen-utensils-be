import { Controller, Get, Post, Body, Patch, Param, Delete, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, UploadedFile, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import axios from 'axios';
import { CreateProductImageDto } from './dto/create-product-image.dto';

@Controller('product-images')
export class ProductImagesController {
    constructor(private readonly productImagesService: ProductImagesService) { }

    @Post()
    @UseInterceptors(FilesInterceptor('product-images'))
    async create(
        @Body() createProductImageDto: CreateProductImageDto,
        @UploadedFiles(
            new ParseFilePipe({ validators: [new MaxFileSizeValidator({ maxSize: 9000000 }), new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),], })
        )

        files: Express.Multer.File[]) {
        console.log(files);
        const chainPromise = files.map(file => {
            const base64 = file.buffer.toString('base64');
            const formData = new URLSearchParams();
            formData.append('key', process.env.IMGBB_AVATAR_API_KEY || '');
            formData.append('image', base64);

            return axios.post('https://api.imgbb.com/1/upload', formData.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
        });

        try {
            const data = await Promise.all(chainPromise);

            let listImageUrl = await Promise.all(data.map(async (item) => {
                const imageUrl = item.data.data.url;
                return imageUrl;
            }));

            await this.productImagesService.create(createProductImageDto.product_id, createProductImageDto.isMain, listImageUrl);
        } catch (error) {
            console.log(error);
            return new BadRequestException('Error create product image');
        }
        // await Promise.all(chainCreate);

        return "hello"
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
