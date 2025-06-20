import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleLanguage } from "./entities/article_languages.entity";
import { ArticleLanguagesController } from "./article_languages.controller";
import { ArticleLanguagesService } from "./article_languages.service";
import { Article } from "src/article/entities/article.entity";

@Module({
   imports: [TypeOrmModule.forFeature([ArticleLanguage, Article])],
   controllers: [ArticleLanguagesController],
   providers: [ArticleLanguagesService],
   exports: []
})

export class ArticleLanguageModule {}