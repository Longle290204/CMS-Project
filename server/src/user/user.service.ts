import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
   constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

   async getById(user: User): Promise<User> {
      const id = user.id;
      // Find profile in db by id
      const profile = await this.userRepo.findOne({ where: { id } });
      if (!profile) {
         throw new NotFoundException(`Not found profile`);
      }
      return profile;
   }

   getAll() {
      return this.userRepo.find();
   }

   async getFilterUser(search: string): Promise<User[]> {
      // <============ C1: Raw SQL =============>
      // const keyword = String(search);
      // return await this.userRepo.query(
      //    `
      //   SELECT "user".*
      //   FROM "user"
      //   WHERE "user"."username" ILIKE $1
      //      OR "user"."email" ILIKE $1
      // `,
      //    [`%${keyword}%`],
      // );
      // <============ C2: TypeORM =============>
      // return this.userRepo.find({ where: [{ username: ILike(`%${search}%`) }, { email: ILike(`%${search}%`) }] });
      // <============ C3: QueryBuilder =============>
      return await this.userRepo
         .createQueryBuilder('user')
         .where('user.username ILIKE :search', { search: `%${search}%` })
         .orWhere('user.email ILIKE :search', { search: `%${search}%` })
         .getMany();
   }

   async createUser(dto: CreateUserDto): Promise<any> {
      const { username, email, password } = dto;
      // Hash password
      const salt = bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      // Create user
      const newUser = this.userRepo.create({
         username,
         email,
         password: hashPassword,
      });
      return this.userRepo.save(newUser);
   }

   updateUser(id: string, dto: UpdateUserDto) {
      const { username, email } = dto;
      // C1: QueryBuilder
      // this.userRepo
      //    .createQueryBuilder()
      //    .update(User)
      //    .set({ username: username, email: email })
      //    .where('id = :id', { id });
      this.userRepo.query(`
         UPDATE TABLE "user"
         SET "username" = ${username}, "email" = ${email}
         WHERE "id" = ${id}
         `);
   }

   async deleteUser(id: string): Promise<string> {
      const result = await this.userRepo.delete(id);
      // Check whether or not user in database
      if (result.affected === 0) {
         throw new NotFoundException(`Not found ${id}`);
      }
      return `Delete successfully`;
   }

   async logOut(id: string) {
      // <========== Find user ===========>
      // C1: Raw SQL
      // const userExist = await this.userRepo.query(
      //    `SELECT "user".*
      //     FROM "user"
      //     WHERE "id" = '${id}'`,
      // );
      // C2: TypeORM
      const userExist = await this.userRepo.findOne({ where: { id } });
      if (!userExist) {
         throw new NotFoundException(`Not found user`);
      }

      // <============= Update refresh token ===============>
      // C1: TypeORM
      userExist.refreshToken = ' ';
      await this.userRepo.save(userExist);

      // C2: Raw SQL
      // this.userRepo.query(`UPDATE "user"
      //                            SET "refreshToken" = ' '
      //                            WHERE "id" = $1`, [id]);

      // C3: Query builder
      // this.userRepo
      //    .createQueryBuilder()
      //    .update(userExist)
      //    .set({ refreshToken: ' ' })
      //    .where('id = :id', { id })
      //    .execute();
   }

   async changePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
      const { oldPassword, newPassword, confirmNewPassword } = updatePasswordDto;

      const userExist = await this.userRepo.findOneBy({ id });
      if (!userExist) {
         throw new NotFoundException(`Not found user`);
      }
      if (newPassword != confirmNewPassword) {
         throw new BadRequestException(`Confirm password is wrong`);
      }
      if (!(await bcrypt.compare(oldPassword, userExist.password))) {
         throw new BadRequestException(`Old password is wrong`);
      }
      userExist.password = ' ';
      const salt = await bcrypt.genSalt();
      const hashNewPassWord = await bcrypt.hash(newPassword, salt);
      userExist.password = hashNewPassWord;
      return await this.userRepo.save(userExist);

      // C2: Raw SQL
      // await this.userRepo.query(`UPDATE "user"
      //                                  SET "password" = ${hashNewPassWord}`)

      // C3: Query builder
      // this.userRepo
      //    .createQueryBuilder()
      //    .update(userExist)
      //    .set({ password: hashNewPassWord })
      //    .where('id = :id', { id });
   }
}
