import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Like, Not, Repository } from 'typeorm';
import { FilterCategoryDto } from './dto/filter-category.dto';

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

  async getFilteredCategories(filterDto: FilterCategoryDto) {
    const { keyword, page, limit } = filterDto;

    const pageNumber = page ? parseInt(page) : 1;
    const limitNumber = limit ? parseInt(limit) : 6;

    const where: any = {};

    if (keyword) {
      where.category_name = Like(`%${keyword.toLowerCase()}%`);
    }

    const [categories, total] = await this.categoryRepository.findAndCount({
      where,
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    return {
      data: categories,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  findAll() {
    return this.categoryRepository.find();
  }

  findOne(id: number | null) {
    if (id === null) {
      return null;
    }
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
