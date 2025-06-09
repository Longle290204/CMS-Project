import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/createArticle.dto';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ArticlesService {
   constructor(
      @InjectRepository(Article) private readonly articleRepo: Repository<Article>,
      @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
   ) {}

   async createArticle(createArticleDto: CreateArticleDto, user: User): Promise<Article> {
      const { categoryId, thumbnail, status, priority_top, language } = createArticleDto;

      const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
      if (!category) {
         throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }

      const languageArray = language;
      const hasVieLang = languageArray.find((language) => language.language === 'vi');
      if (!hasVieLang) {
         throw new BadRequestException(`Vietnamese is required`);
      }

      const newArticle = this.articleRepo.create({
         category,
         thumbnail,
         status,
         priority_top,
         languages: language,
         created_by: user,
      });

      return this.articleRepo.save(newArticle);
   }

   async getAll(): Promise<Article[]> {
      const articles = this.articleRepo.find({ relations: ['category', 'languages'] });
      return articles;
   }
}
