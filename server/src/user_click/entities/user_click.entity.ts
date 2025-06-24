import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Article } from 'src/article/entities/article.entity';

@Entity()
export class UserClick {
   @PrimaryGeneratedColumn('uuid')
   id: String;

   @ManyToOne(() => User, (user) => user.userClick)
   user: User;

   @ManyToOne(() => Article, (article) => article.userClick)
   article: Article;

   @Column({ default: 0 })
   clickCount: number;

   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
   lastClickAt: Date;
}
