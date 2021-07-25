import { boolean } from 'joi';
import { Verification } from './entities/verification.entity';
import { EditProfileInput, EditProfileOutput } from './dto/edit-user-profile';
import { ConfigService } from '@nestjs/config';
import { LoginUserInput } from './dto/login-user.dto';
import { CreateUserInput } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { VerifyEmailInput, VerifyEmailOutput } from './dto/verify-email.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}
  async createAccount({
    email,
    password,
    role,
  }: CreateUserInput): Promise<[boolean, string?]> {
    const userExists = await this.users.findOne({ email });
    try {
      if (userExists) {
        return [
          false,
          `Your account with the following email address ${email} already exists`,
        ];
      } else {
        const createUser = this.users.create({ email: email, password, role });
        const user = await this.users.save(createUser);
        const verification = await this.verifications.save(
          this.verifications.create({ user }),
        );
        this.mailService.sendVerificationEmail(user.email, verification.code);
        return [true];
      }
    } catch (error) {
      return [true, `Account with email: ${email} already exists`];
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number): Promise<User> {
    return await this.users.findOne({ id });
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    const user = await this.users.findOne({ id: userId });
    try {
      if (email) {
        user.email = email;
        user.verified = false;
        const verification = await this.verifications.save(
          this.verifications.create({ user }),
        );
        this.mailService.sendVerificationEmail(user.email, verification.code);
      }
      if (password) {
        user.password = password;
      }
      await this.users.save(user);
      return { user, ok: true, error: null };
    } catch (error) {
      return { user: null, ok: false, error };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async login({
    email,
    password,
  }: LoginUserInput): Promise<[boolean, string, string?]> {
    const user = await this.users.findOne(
      { email },
      { select: ['id', 'password'] },
    );
    try {
      if (user) {
        const validPassword = await user.checkPassword(password);
        if (validPassword) {
          const token = this.jwtService.sign({ id: user.id });
          return [true, null, token];
        } else {
          return [
            false,
            `Hey User with email: ${email}, your password is not correct`,
          ];
        }
      } else {
        return [false, `User with email: ${email} not found`];
      }
    } catch (error) {
      return [false, error];
    }
  }

  async verifyEmail({ code }: VerifyEmailInput): Promise<VerifyEmailOutput> {
    const verification = await this.verifications.findOne(
      { code },
      { relations: ['user'] },
    );
    try {
      if (verification) {
        console.log(verification);
        verification.user.verified = true;
        await this.users.save(verification.user);
        await this.verifications.delete(verification.id);
        return { ok: true, error: null };
      }
      throw new Error();
    } catch (error) {
      return { ok: false, error };
    }
  }
}
