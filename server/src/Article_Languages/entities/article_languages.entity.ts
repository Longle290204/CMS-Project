import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from 'src/article/entities/article.entity';
import { LanguageType } from '../enum/language.enum';
import { Tag } from 'src/tags/entities/tag.entity';

@Entity()
export class ArticleLanguage {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({ type: 'enum', enum: LanguageType, default: LanguageType.VI })
   language: LanguageType;

   @Column({ type: 'varchar', nullable: true })
   title: string;

   @Column({ type: 'text', nullable: true })
   content: string;

   @OneToMany(() => Tag, (tag) => tag.articleLanguage, {
      eager: true,
      cascade: true,
      onUpdate: 'CASCADE',
   })
   tags: Tag[];

   @ManyToOne(() => Article, (article) => article.languages, { onDelete: 'CASCADE' })
   article: Article;
}
