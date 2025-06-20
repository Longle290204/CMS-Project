import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf, IsArray, ValidateNested } from 'class-validator';
import { LanguageType } from '../enum/language.enum';
import { CreateTagDto } from 'src/tags/dto/CreateTag.dto';
import { Type } from 'class-transformer';

export class CreateArticleLanguageDto {
   @IsEnum(LanguageType)
   language: LanguageType;

   @ValidateIf((o) => o.language === LanguageType.VI)
   @IsNotEmpty()
   @IsString()
   title: string;

   @ValidateIf((o) => o.language === LanguageType.VI)
   @IsNotEmpty()
   @IsString()
   content: string;

   @IsArray()
   @ValidateNested({ each: true })
   @IsOptional()
   @Type(() => CreateTagDto)
   tags: CreateTagDto[];
}
