import { IsString, Matches, MinLength, MaxLength } from 'class-validator';

export enum UserRole {
   Admin = 'admin',
   User = 'user',
   Editor = 'editor',
}

export class CreateUserDto {
   @IsString()
   @MinLength(7)
   @MaxLength(20)
   username: string;

   @IsString()
   @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: 'wrong email structure',
   })
   email: string;

   @IsString()
   @MinLength(7)
   @MaxLength(20)
   password: string;
}
