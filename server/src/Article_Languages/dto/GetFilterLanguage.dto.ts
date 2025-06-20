import { IsString } from 'class-validator';

export class GetFilterLanguageDto {
   @IsString()
   language?: string;
}
