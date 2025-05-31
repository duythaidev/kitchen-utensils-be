import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const isExist = await this.categoryRepository.findOne({ where: { category_name: createCategoryDto.category_name, }, });

    if (isExist !== null) {
      throw new BadRequestException('Category already exists');
    }

    return this.categoryRepository.save(createCategoryDto);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  findOne(id: number) {
    return this.categoryRepository.findOne({ where: { id }, });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {

    // Tìm thông tin category
    const category = await this.categoryRepository.findOne({ where: { id: Not(id), category_name: updateCategoryDto.category_name } })
    if (category !== null) {
      throw new BadRequestException('Tên category đã tồn tại')
    }
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  remove(id: number) {
    return this.categoryRepository.delete(id);
  }
}
