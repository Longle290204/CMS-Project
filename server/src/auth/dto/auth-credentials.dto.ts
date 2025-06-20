import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class AuthSignUpDto {
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
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
}

export class AuthSignInDto {
  @IsString()
  @MinLength(7)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(7)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
}
