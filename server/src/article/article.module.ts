import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { ArticlesService } from './article.service';
import { ArticlesController } from './article.controller';
import { Category } from 'src/categories/entities/category.entity';
import { ArticleLanguage } from 'src/Article_Languages/entities/article_languages.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Article, Category, ArticleLanguage])],
   providers: [ArticlesService],
   controllers: [ArticlesController],
})
export class ArticleModule {}
