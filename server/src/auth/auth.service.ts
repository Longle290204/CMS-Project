import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthSignUpDto, AuthSignInDto } from './dto/auth-credentials.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from './role/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
   constructor(
      private jwtService: JwtService,
      @InjectRepository(User) private readonly userRepository: Repository<User>,
      @InjectDataSource() private readonly dataSource: DataSource,
   ) {}

   async signUp(authSignUpDto: AuthSignUpDto): Promise<void> {
      const { username, email, password } = authSignUpDto;

      const usernameExists = await this.userRepository.findOne({
         where: { username },
      });
      if (usernameExists) {
         throw new ConflictException('Username already exists');
      }

      const emailExists = await this.userRepository.findOne({ where: { email } });
      if (emailExists) {
         throw new ConflictException(`Email already exists`);
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.userRepository.create({
         username,
         email,
         password: hashedPassword,
      });

      try {
         await this.userRepository.save(user);
      } catch (error) {
         console.log(error);

         if (error.code === '23505') {
            // Race condition
            if (error.detail.includes('username')) {
               throw new ConflictException('Username already exists');
            } else if (error.detail.includes('email')) {
               throw new ConflictException('Email already exists');
            }
         } else {
            throw new ConflictException('Error creating user');
         }
      }
   }

   async signIn(authSignInDto: AuthSignInDto): Promise<{ accessToken: string; refreshToken: string }> {
      const { username, password } = authSignInDto;

      const user = await this.userRepository.findOne({ where: { username } });

      if (user && (await bcrypt.compare(password, user.password))) {
         const payload = { username: username, id: user.id, roles: Role.User };
         const accessToken: string = await this.jwtService.signAsync(payload, { expiresIn: '15m' });
         const refreshToken: string = await this.jwtService.signAsync(payload, { expiresIn: '7d' });

         const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
         // C1: TypeORM
         // await this.userRepository.update(user.id, { refreshToken: hashRefreshToken });

         // C2: QueryBuilder
         // await this.dataSource
         //    .createQueryBuilder()
         //    .update(user)
         //    .set({ refreshToken: hashRefreshToken })
         //    .where('id = :id', { id: user.id })
         //    .execute();

         // C3: Raw SQL
         await this.dataSource.query(`UPDATE "user" SET "refreshToken" = $1 WHERE "id" = $2`, [
            hashRefreshToken,
            user.id,
         ]);

         return { accessToken, refreshToken };
      } else {
         throw new UnauthorizedException('Please check credentials');
      }
   }

   async logOut(id: string) {
      // <========== Find user ===========>
      // C1: Raw SQL
      // const userExist = await this.userRepository.query(
      //    `SELECT "user".*
      //     FROM "user"
      //     WHERE "id" = '${id}'`,
      // );
      // C2: TypeORM
      const userExist = await this.userRepository.findOne({ where: { id } });
      if (!userExist) {
         throw new NotFoundException(`Not found user`);
      }

      // <============= Update refresh token ===============>
      // C1: TypeORM
      userExist.refreshToken = ' ';
      await this.userRepository.save(userExist);

      // C2: Raw SQL
      // this.userRepository.query(`UPDATE "user"
      //                            SET "refreshToken" = ' '
      //                            WHERE "id" = $1`, [id]);

      // C3: Query builder
      // this.userRepository
      //    .createQueryBuilder()
      //    .update(userExist)
      //    .set({ refreshToken: ' ' })
      //    .where('id = :id', { id })
      //    .execute();
   }
}
