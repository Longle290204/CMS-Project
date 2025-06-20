import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { ArticleLanguagesService } from './article_languages.service';
import { CreateArticleLanguageDto } from './dto/CreateArticleLanguage.dto';
import { ArticleLanguage } from './entities/article_languages.entity';
import { Public } from 'src/auth/decorators/public.decorator';
import { GetFilterLanguageDto } from './dto/GetFilterLanguage.dto';
import { Article } from 'src/article/entities/article.entity';

@Controller('language')
export class ArticleLanguagesController {
   constructor(private articleLanguageService: ArticleLanguagesService) {}

   @Post()
   @Public()
   create(@Body() createArticleLanguageDto: CreateArticleLanguageDto): Promise<ArticleLanguage> {
      return this.articleLanguageService.create(createArticleLanguageDto);
   }

   @Get()
   @Public()
   getAll() {
      return this.articleLanguageService.getAll();
   }

   @Get('/:content')
   @Public()
   getFilterLanguageContents(@Query() getFilterLanguageDto: GetFilterLanguageDto): Promise<Article[]> {
      return this.articleLanguageService.getFilterLanguageContents(getFilterLanguageDto);
   }
}