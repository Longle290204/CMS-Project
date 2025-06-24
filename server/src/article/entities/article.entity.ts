import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ArticleLanguage } from 'src/Article_Languages/entities/article_languages.entity';
import { Category } from 'src/categories/entities/category.entity';
import { UserClick } from 'src/user_click/entities/user_click.entity';

export enum ArticleStatus {
   PUBLISHED = 'PUBLISHED',
   DRAFT = 'DRAFT',
   DELETED = 'DELETED',
}

@Entity('article')
export class Article {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @ManyToOne(() => Category, (category) => category.articles, { eager: true })
   category: Category;

   @Column()
   thumbnail: string;

   @Column({ type: 'text', default: null })
   description: string;

   @Column({ default: false })
   is_hot: boolean;

   @Column({ default: 0 })
   priority_top: number;

   @Column({ default: 0 })
   view: number;

   @OneToMany(() => ArticleLanguage, (articleLanguage) => articleLanguage.article, {
      eager: true,
      cascade: true,
      onUpdate: 'CASCADE',
   })
   languages: ArticleLanguage[];

   @ManyToOne(() => User, (user) => user.articles)
   created_by: User;

   @Column({ type: 'enum', enum: ArticleStatus, default: ArticleStatus.DRAFT })
   status: ArticleStatus;

   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
   created_at: Date;

   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
   updated_at: Date;

   @Column({ type: 'timestamp', default: null })
   deleted_at: Date;

   @OneToMany(() => UserClick, (userCLick) => userCLick.article, {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
   })
   userClick: UserClick[];
}
