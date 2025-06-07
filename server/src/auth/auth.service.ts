import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthSignUpDto, AuthSignInDto } from './dto/auth-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
   constructor(
      private jwtService: JwtService,
      @InjectRepository(User) private readonly userRepository: Repository<User>,
   ) {}

   async signUp(authSignUpDto: AuthSignUpDto): Promise<void> {
      const { username, email, password } = authSignUpDto;

      // Check username existence
      const usernameExists = await this.userRepository.findOne({
         where: { username },
      });

      if (usernameExists) {
         throw new ConflictException('Username already exists');
      }

      // Hash password
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
         if (error.code === '23505') {
            throw new ConflictException('Username already exists');
         } else {
            throw new ConflictException('Error creating user');
         }
      }
   }

   async signIn(authSignInDto: AuthSignInDto): Promise<{ accessToken: string; refreshToken: string }> {
      const { username, password } = authSignInDto;

      const user = await this.userRepository.findOne({ where: { username } });

      if (user && (await bcrypt.compare(password, user.password))) {
         const payload = { username: username, id: user.id };
         const accessToken: string = await this.jwtService.signAsync(payload, { expiresIn: '15m' });
         const refreshToken: string = await this.jwtService.signAsync(payload, { expiresIn: '7d' });

         const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
         await this.userRepository.update(user.id, { refreshToken: hashRefreshToken });

         return { accessToken, refreshToken };
      } else {
         throw new UnauthorizedException('Please check credentials');
      }
   }
}
