import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';

@Module({
   imports: [
      TypeOrmModule.forRoot({
         type: 'postgres',
         host: 'localhost',
         port: 5432,
         username: 'postgres',
         password: 'postgres-CMS',
         database: 'CMS',
         entities: [User],
         synchronize: true,
      }),
      AuthModule,
   ],

   providers: [],
   controllers: [],
})
export class AppModule {}
