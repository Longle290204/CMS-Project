import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ArticleLanguage } from 'src/Article_Languages/entities/article_languages.entity';

@Entity()
export class Tag {
   @PrimaryGeneratedColumn()
   id: string;

   @Column({ type: 'varchar' })
   name: string;

   @Column({type: 'varchar', default: null})
   link: string;

   @ManyToOne(() => ArticleLanguage, articleLanguage => articleLanguage.tags)
   articleLanguage: ArticleLanguage;
}
