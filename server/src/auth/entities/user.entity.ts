import { Post } from 'src/posts/entities/post.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
   @PrimaryGeneratedColumn()
   id: number;

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

   @OneToMany(() => Post, (post) => post.created_by)
   posts: Post[];
}
