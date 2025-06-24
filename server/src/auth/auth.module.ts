import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Article } from 'src/article/entities/article.entity';
import { UserClick } from 'src/user_click/entities/user_click.entity';

@Module({
   imports: [
      TypeOrmModule.forFeature([User, Article, UserClick]),
      JwtModule.register({
         global: true,
         secret: jwtConstants.secret,
         signOptions: { expiresIn: '15m' },
      }),
   ],
   controllers: [AuthController],
   providers: [AuthService],
   exports: [AuthService],
})
export class AuthModule {}
