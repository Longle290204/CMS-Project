import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserClick } from './entities/user_click.entity';
import { UserClickController } from './user_click.controller';
import { UserClickService } from './user_click.service';
import { User } from 'src/user/entities/user.entity';
import { Article } from 'src/article/entities/article.entity';

@Module({
   imports: [TypeOrmModule.forFeature([UserClick, User, Article])],
   controllers: [UserClickController],
   providers: [UserClickService],
   exports: [],
})
export class UserClickModule {}
