import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/jwt-auth.guard';
import { ArticleLanguageModule } from './Article_Languages/article_languages.module';
import { ArticleModule } from './article/article.module';
import { CategoryModule } from './categories/category.module';
import { TagModule } from './tags/tag.module';
import { UserClickModule } from './user_click/user_click.module';

@Module({
   imports: [
      TypeOrmModule.forRoot({
         type: 'postgres',
         host: 'localhost',
         port: 5432,
         username: 'postgres',
         password: 'postgres-CMS',
         database: 'CMS',
         // entities: [User, Article, ArticleLanguage, Category],
         autoLoadEntities: true,
         synchronize: true,
      }),
      AuthModule,
      ArticleLanguageModule,
      ArticleModule,
      CategoryModule,
      UserClickModule,
      TagModule,
   ],

   providers: [
      // Apply authentication globally
      {
         provide: APP_GUARD,
         useClass: AuthGuard,
      },
   ],
   controllers: [],
})
export class AppModule {}
