import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { ArticlesService } from './article.service';
import { ArticlesController } from './article.controller';
import { User } from 'src/auth/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { ArticleTag } from 'src/article_tags/entities/article_tag.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Article, User, Category, ArticleTag])],
   providers: [ArticlesService],
   controllers: [ArticlesController],
})
export class ArticleModule {}
