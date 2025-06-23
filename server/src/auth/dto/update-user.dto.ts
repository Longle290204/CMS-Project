import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class UpdateUserDto {
   @IsString()
   oldPassword: string;

   @IsString()
   newPassword: string;

   @IsString()
   confirmNewPassword: string;
}
