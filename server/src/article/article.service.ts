import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/createArticle.dto';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { ArticleLanguage } from 'src/Article_Languages/entities/article_languages.entity';

@Injectable()
export class ArticlesService {
   constructor(
      @InjectRepository(Article) private readonly articleRepo: Repository<Article>,
      @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
      @InjectRepository(ArticleLanguage) private readonly articleLangRepo: Repository<ArticleLanguage>,
   ) {}

   async createArticle(createArticleDto: CreateArticleDto, user: User): Promise<Article> {
      const { categoryId, status, priority_top, languages } = createArticleDto;
      // Check category
      const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
      if (!category) {
         throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
      // Must have at least one 'vi' language
      const languageArray = languages;
      const hasVieLang = languageArray.find((language) => language.language === 'vi');
      if (!hasVieLang) {
         throw new BadRequestException(`Vietnamese is required`);
      }
      // Create and save into database
      const newArticle = this.articleRepo.create({
         category,
         status,
         priority_top,
         thumbnail: createArticleDto.thumbnail,
         languages: languages,
         created_by: user,
      });

      return this.articleRepo.save(newArticle);
   }

   async getAll(): Promise<Article[]> {
      const articles = this.articleRepo.find({ relations: ['category', 'languages'] });
      return articles;
   }

   async deleteArticle(id: string): Promise<string> {
      const result = await this.articleRepo.delete({ id });

      if (result.affected === 0) {
         throw new NotFoundException(`Not found ${id}`);
      }

      return 'Delete successfully!';
   }

   async update(id: string, updateArticleDto: UpdateArticleDto): Promise<void> {
      const { thumbnail, description, is_hot, priority_top, languages, status } = updateArticleDto;
      const article = await this.articleRepo.findOne({ where: { id }, relations: ['languages', 'languages.tags'] });
      if (!article) {
         throw new NotFoundException(`Article with ID ${id} not found`);
      }

      article.thumbnail = thumbnail ?? article.thumbnail;
      article.description = description ?? article.description;
      article.is_hot = is_hot ?? article.is_hot;
      article.priority_top = priority_top ?? article.priority_top;
      article.status = status ?? article.status;

      article.languages = [];

      for (let i = 0; i < languages.length; i++) {
         const lang = this.articleLangRepo.create({
            language: languages[i].language,
            title: languages[i].title,
            content: languages[i].content,
            tags: languages[i].tags,
         });
         article.languages.push(lang);
      }

      await this.articleRepo.save(article);
   }
}

// Đặt state bằng 0
