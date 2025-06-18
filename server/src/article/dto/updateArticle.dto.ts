import { IsArray, IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ArticleStatus } from '../entities/article.entity';
import { Type } from 'class-transformer';
import { UpdateArticleLanguageDto } from 'src/Article_Languages/dto/UpdateArticleLanguage.dto';

export class UpdateArticleDto {
   @IsOptional()
   @IsString()
   thumbnail: string;

   @IsOptional()
   @IsString()
   description: string;

   @IsOptional()
   @IsBoolean()
   is_hot: boolean;

   @IsOptional()
   @IsNumber()
   priority_top: number;

   @IsOptional()
   @IsArray()
   @Type(() => UpdateArticleLanguageDto)
   languages: UpdateArticleLanguageDto[];

   @IsOptional()    
   @IsString()
   @IsEnum(ArticleStatus)
   status?: ArticleStatus;
}
