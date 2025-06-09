import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { CreateArticleLanguageDto } from 'src/Article_Languages/dto/CreateArticleLanguage.dto';
import { ArticleStatus } from '../entities/article.entity';

export class CreateArticleDto {
   @IsUUID()
   categoryId: string;

   @IsString()
   @IsOptional()
   thumbnail: string;

   @IsOptional()
   priority_top: number;

   @IsEnum(ArticleStatus)
   @IsOptional()
   status?: ArticleStatus;

   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => CreateArticleLanguageDto)
   language: CreateArticleLanguageDto[];
}
