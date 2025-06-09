import { Body, Controller, Post, Get, Patch } from '@nestjs/common';
import { ArticlesService } from './article.service';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('article')
export class ArticlesController {
   constructor(private articleService: ArticlesService) {}

   @Post()
   @Public()
   createArticle(@Body() createArticleDto: CreateArticleDto, @GetUser() user: User): Promise<Article> {
      return this.articleService.createArticle(createArticleDto, user);
   }

   @Get()
   @Public()
   getAllArticles(): Promise<Article[]> {
      return this.articleService.getAll();
   }

   // @Patch()
   // updateArticle(): Promise<void> {
   //    return this.postService.updateArticle();
   // }
}
