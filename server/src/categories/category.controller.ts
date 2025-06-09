import { Body, Controller, Post, Get, Delete, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/CreateCategory.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Public()
@Controller('category')
export class CategoryController {
   constructor(private readonly categoryService: CategoryService) {}

   @Post()
   create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
      return this.categoryService.create(createCategoryDto);
   }

   @Get()
   getAll(): Promise<Category[]> {
      return this.categoryService.getAll();
   }

   @Delete('/:id')
   delete(@Param('id') id: string): Promise<string> {
      return this.categoryService.delete(id);
   }
}
