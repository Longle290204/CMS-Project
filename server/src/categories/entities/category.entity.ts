import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from 'src/article/entities/article.entity';

@Entity()
export class Category {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({ type: 'varchar' })
   name: string;

   @OneToMany(() => Article, (article) => article.category)
   articles: Article[];
}
