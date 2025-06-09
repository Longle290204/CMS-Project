import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/CreateCategory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
   constructor(@InjectRepository(Category) private readonly categoryRepo: Repository<Category>) {}

   create(createCategoryDto: CreateCategoryDto): Promise<Category> {
      const { name } = createCategoryDto;

      const category = this.categoryRepo.create({
         name,
      });

      return this.categoryRepo.save(category);
   }

   getAll(): Promise<Category[]> {
      return this.categoryRepo.find();
   }

   async delete(id: string): Promise<string> {
      // this.categoryRepo.createQueryBuilder().delete().from(Category).where('id = :id', { id }).execute();
      const result = await this.categoryRepo.delete({ id });

      if (result.affected === 0) {
         throw new NotFoundException(`Not found id ${id}`);
      }

      return 'Delete successfully!';
   }
}
