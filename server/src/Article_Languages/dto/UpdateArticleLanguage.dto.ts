import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { LanguageType } from '../enum/language.enum';
import { Type } from 'class-transformer';
import { CreateTagDto } from 'src/tags/dto/CreateTag.dto';

export class UpdateArticleLanguageDto {
   @IsOptional()
   @IsEnum(LanguageType)
   language: LanguageType;

   @IsOptional()
   @IsString()
   title: string;

   @IsOptional()
   @IsString()
   content: string;

   @IsOptional()
   @IsArray()
   @Type(() => CreateTagDto)
   tags: CreateTagDto[];
}
