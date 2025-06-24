import {
   Body,
   Controller,
   Post,
   Get,
   Patch,
   Delete,
   Param,
   UseInterceptors,
   UploadedFile,
   BadRequestException,
} from '@nestjs/common';
import { ArticlesService } from './article.service';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Public } from 'src/auth/decorators/public.decorator';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { Roles } from 'src/auth/role/roles.decorator';
import { Role } from 'src/auth/role/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validate, Validate, ValidationError } from 'class-validator';

@Controller('article')
export class ArticlesController {
   constructor(private articleService: ArticlesService) {}

   @Post()
   // @Roles(Role.Admin)
   @UseInterceptors(FileInterceptor('thumbnail'))
   async createArticle(
      @UploadedFile() thumbnail: Express.Multer.File,
      @Body('createArticleDto') createArticleDtoRaw: string,
      @GetUser() user: User,
   ): Promise<Article> {
      // Transform the plain object into an instance of dto
      const dto = plainToInstance(CreateArticleDto, JSON.parse(createArticleDtoRaw));
      // Check constrain class-validate
      const error = await validate(dto);
      if (error.length > 0) {
         throw new BadRequestException(error);
      }

      if (thumbnail) {
         dto.thumbnail = `/uploads/${thumbnail.filename}`;
      }
      return this.articleService.createArticle(dto, user);
   }

   @Get()
   @Public()
   getAllArticles(): Promise<Article[]> {
      return this.articleService.getAll();
   }

   @Delete(':id')
   @Public()
   deleteArticle(@Param('id') id: string): Promise<string> {
      return this.articleService.deleteArticle(id);
   }

   @Public()
   @Patch('update/:id')
   async update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto): Promise<void> {
      return this.articleService.update(id, updateArticleDto);
   }
}
