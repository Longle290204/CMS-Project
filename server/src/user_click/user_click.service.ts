import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserClick } from './entities/user_click.entity';
import { Repository } from 'typeorm';
import { Article } from 'src/article/entities/article.entity';

@Injectable()
export class UserClickService {
   constructor(
      @InjectRepository(UserClick) private readonly userClickRepo: Repository<UserClick>,
      @InjectRepository(Article) private readonly articleRepo: Repository<Article>,
   ) {}

   async handleClick(userId: string, articleId: string): Promise<any> {
      let record = await this.userClickRepo.findOne({ where: { user: { id: userId }, article: { id: articleId } } });
      if (record) {
         record.clickCount++;
         record.lastClickAt = new Date();
      } else {
         record = this.userClickRepo.create({
            user: { id: userId },
            article: { id: articleId },
            clickCount: 1,
            lastClickAt: new Date(),
         });
      }
      await this.userClickRepo.save(record);
      // Update view in article
      const article = await this.articleRepo.findOneBy({ id: articleId });
      if (article) {
         article.view = record.clickCount;
         await this.articleRepo.save(article);
      }
   }

   async getAll(): Promise<UserClick[]> {
      const records = this.userClickRepo
         .createQueryBuilder('user_click')
         .leftJoinAndSelect('user_click.user', 'user')
         .leftJoinAndSelect('user_click.article', 'article')
         .getMany();

      // const records = this.userClickRepo.query(
      //    `SELECT
      //    "user_click".id,
      //    "user"."id" AS "userId", "user".*,
      //    "article"."id" AS "articleId", "article".*,
      //    "user_click"."clickCount", "user_click"."lastClickAt"

      //    FROM "user_click"
      //    LEFT JOIN "user" ON "user"."id" = "user_click"."userId"
      //    LEFT JOIN "article" ON "article"."id" = "user_click"."articleId"
      //    `,
      // );
      return records;
   }
}
