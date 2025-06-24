import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { ArticlesService } from './article.service';
import { ArticlesController } from './article.controller';
import { Category } from 'src/categories/entities/category.entity';
import { ArticleLanguage } from 'src/Article_Languages/entities/article_languages.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { User } from 'src/user/entities/user.entity';

@Module({
   imports: [
      TypeOrmModule.forFeature([Article, Category, ArticleLanguage, User]),
      MulterModule.register({
         storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
               const filename = `${Date.now()}-${file.originalname}`;
               cb(null, filename);
            },
         }),
      }),
   ],
   providers: [ArticlesService],
   controllers: [ArticlesController],
})
export class ArticleModule {}
