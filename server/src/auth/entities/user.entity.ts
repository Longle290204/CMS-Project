import { Article } from 'src/article/entities/article.entity';
import { UserClick } from 'src/user_click/entities/user_click.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   username: string;

   @Column()
   password: string;

   @Column({ unique: true })
   email: string;

   @Column({ nullable: true })
   refreshToken: string;

   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
   createdAt: Date;

   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
   updatedAt: Date;

   @OneToMany(() => Article, (article) => article.created_by, { eager: true, cascade: true })
   articles: Article[];

   @OneToMany(() => UserClick, (userClick) => userClick.user, {
      cascade: true,
      eager: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
   })
   userClick: UserClick[];
}
