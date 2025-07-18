import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
   @IsString()
   @IsOptional()
   name: string;
}
