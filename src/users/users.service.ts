import { Verification } from './entities/verification.entity';
import { EditProfileInput, EditProfileOutput } from './dto/edit-user-profile';

import { LoginUserInput, LoginUserOutput } from './dto/login-user.dto';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { VerifyEmailInput, VerifyEmailOutput } from './dto/verify-email.dto';
import { MailService } from 'src/mail/mail.service';
import { UserProfileInput, UserProfileOutput } from './dto/user-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}
  async createAccount({
    email,
    password,
    role,
  }: CreateUserInput): Promise<CreateUserOutput> {
    const userExists = await this.users.findOne({ email });
    try {
      if (userExists) {
        return {
          ok: false,
          error: `Your account with the following email address ${email} already exists`,
        };
      } else {
        const createUser = this.users.create({ email: email, password, role });
        const user = await this.users.save(createUser);
        const verification = await this.verifications.save(
          this.verifications.create({ user }),
        );
        this.mailService.sendVerificationEmail(user.email, verification.code);
        return {
          ok: true,
          error: null,
        };
      }
    } catch (error) {
      return { ok: false, error };
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

  async userProfile(
    userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne(userProfileInput.userId);
      if (!user) {
        throw new Error();
      }
      return {
        ok: Boolean(user),
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'User not found',
      };
    }
  }

  async login({ email, password }: LoginUserInput): Promise<LoginUserOutput> {
    const user = await this.users.findOne(
      { email },
      { select: ['id', 'password'] },
    );
    try {
      if (user) {
        const validPassword = await user.checkPassword(password);
        if (validPassword) {
          const token = this.jwtService.sign({ id: user.id });
          return { ok: true, error: null, token };
        } else {
          return {
            ok: false,
            error: `Hey User with email: ${email}, your password is not correct`,
          };
        }
      } else {
        return { ok: false, error: `User with email: ${email} not found` };
      }
    } catch (error) {
      return { ok: false, error };
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
