import { Controller, Get, Post, Body, Patch, Param, Delete, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, UploadedFile, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import axios from 'axios';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { Public } from 'src/decorators/public.decorator';
import { UserRole } from 'src/decorators/roles.decorator';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('product-images')
export class ProductImagesController {
    constructor(private readonly productImagesService: ProductImagesService) { }

    @Roles(UserRole.Admin)
    @Post()
    @UseInterceptors(FilesInterceptor('product-images'))
    async create(
        @Body() createProductImageDto: CreateProductImageDto,
        @UploadedFiles(
            new ParseFilePipe({ validators: [new MaxFileSizeValidator({ maxSize: 9000000 }), new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),], })
        )

        files: Express.Multer.File[]) {
        // console.log(files);
        if (files.length > 3) {
            throw new BadRequestException('Product images should only have max of 3 images');
        }
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
            // console.log("controller", listImageUrl)
            const res = await this.productImagesService.create(createProductImageDto.product_id, createProductImageDto.isMain, listImageUrl);
            // console.log("controller", res)
            return res;
        } catch (error) {
            console.log(error);
            return new BadRequestException('Error create product image');
        }
        // await Promise.all(chainCreate);

    }

    @Public()
    @Get()
    findAll() {
        return this.productImagesService.findAll();
    }

    @Public()
    @Get('product/:productId')
    findByProductId(@Param('productId') productId: string) {
        return this.productImagesService.findByProductId(+productId);
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productImagesService.findOne(+id);
    }

    @Roles(UserRole.Admin)
    @Patch(':id')
    @UseInterceptors(FilesInterceptor('product-images'))
    async update(
        @Param('id') id: string,
        @Body() updateProductImageDto: UpdateProductImageDto,
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 9_000_000 }),
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                ],
            })
        )
        files: Express.Multer.File[],
    ) {
        if (files.length > 3) {
            throw new BadRequestException('Product images should only have max of 3 images');
        }
        try {
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

            const responses = await Promise.all(chainPromise);
            const imageUrls = responses.map(res => res.data.data.url);

            const result = await this.productImagesService.update(+id, +updateProductImageDto.isMain, imageUrls);

            return result;
        } catch (error) {
            console.log(error);
            throw new BadRequestException('Error updating product images');
        }
    }


    @Delete(':id')
    @Roles(UserRole.Admin)
    remove(@Param('id') id: string) {
        return this.productImagesService.remove(+id);
    }
}
