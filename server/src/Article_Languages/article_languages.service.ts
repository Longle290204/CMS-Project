import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleLanguage } from './entities/article_languages.entity';
import { Repository } from 'typeorm';
import { CreateArticleLanguageDto } from './dto/CreateArticleLanguage.dto';
import { GetFilterLanguageDto } from './dto/GetFilterLanguage.dto';
import { Article } from 'src/article/entities/article.entity';

@Injectable()
export class ArticleLanguagesService {
   constructor(
      @InjectRepository(ArticleLanguage)
      private postLanguageRepo: Repository<ArticleLanguage>,
      @InjectRepository(Article)
      private readonly articleRepo: Repository<Article>,
   ) {}

   async create(createArticleLanguageDto: CreateArticleLanguageDto): Promise<ArticleLanguage> {
      const { language, title, content, tags } = createArticleLanguageDto;

      const newLanguage = this.postLanguageRepo.create({
         language,
         title,
         content,
         tags,
      });

      return this.postLanguageRepo.save(newLanguage);
   }

   async getAll() {
      const languages = await this.postLanguageRepo.find();

      return languages;
   }

   async getFilterLanguageContents(getFilterLanguageDto: GetFilterLanguageDto): Promise<Article[]> {
      const { language } = getFilterLanguageDto;

      // C1: QueryBuilder
      const articles = await this.articleRepo
         .createQueryBuilder('article')
         .leftJoinAndSelect('article.category', 'category')
         .leftJoinAndSelect('article.languages', 'language')
         .leftJoinAndSelect('language.tags', 'tags')
         .where('language.language = :lang', {
            lang: language,
         })
         .getMany();

      // C2: Raw SQL
      // const articles = await this.articleRepo.query(
      //    `SELECT "article".*, "al".*, "tag".*
      //     FROM "article"
      //     LEFT JOIN "article_language" AS "al" ON "al"."articleId" = "article"."id"
      //     LEFT JOIN "tag" ON "tag"."articleLanguageId" = "al"."id"
      //     WHERE "al"."language" = '${language}'`,
      // );
      return articles;
   }
}
