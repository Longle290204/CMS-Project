import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/jwt-auth.guard';

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

   providers: [

      // Apply authentication globally
      {
         provide: APP_GUARD,
         useClass: AuthGuard,
      },
   ],
   controllers: [],
})
export class AppModule {}
