import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserDto {
   @IsOptional()
   @IsString()
   username: string;

   @IsOptional()
   @IsString()
   @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: 'wrong email structure',
   })
   email: string;

   @IsOptional()
   @IsBoolean()
   isActive: boolean;
}
