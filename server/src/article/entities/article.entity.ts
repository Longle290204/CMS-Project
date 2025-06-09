import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ArticleLanguage } from 'src/Article_Languages/entities/article_languages.entity';
import { Category } from 'src/categories/entities/category.entity';
import { ArticleTag } from 'src/article_tags/entities/article_tag.entity';

export enum ArticleStatus {
   PUBLISHED = 'PUBLISHED',
   DRAFT = 'DRAFT',
   DELETED = 'DELETED',
}

@Entity('articles')
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

   @OneToMany(() => ArticleLanguage, (articleLanguage) => articleLanguage.article, { cascade: true })
   languages: ArticleLanguage[];

   @OneToMany(() => ArticleTag, (articleTag) => articleTag.article)
   articleTag: ArticleTag[];

   @ManyToOne(() => User, (user) => user.articles, { cascade: true, onDelete: 'CASCADE' })
   created_by: User;

   @Column({ type: 'enum', enum: ArticleStatus, default: ArticleStatus.DRAFT })
   status: ArticleStatus;

   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
   created_at: Date;

   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
   updated_at: Date;

   @Column({ type: 'timestamp', default: null })
   deleted_at: Date;
}
