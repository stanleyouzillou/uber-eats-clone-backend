import { EditProfileInput } from './dto/edit-user-profile';
import { ConfigService } from '@nestjs/config';
import { LoginUserInput } from './dto/login-user.dto';
import { CreateUserInput } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async createAccount({
    email,
    password,
    role,
  }: CreateUserInput): Promise<[boolean, string?]> {
    const userExists = await this.users.findOne({ email });
    try {
      const createUser = this.users.create({ email: email, password, role });
      if (userExists) {
        return [
          false,
          `Your account with the following email address ${email} has been created`,
        ];
      } else {
        await this.users.save(createUser);
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

  async update(
    id: number,
    editProfileInput: EditProfileInput,
  ): Promise<[boolean, string]> {
    const user = await this.users.findOne({ id });
    try {
      if (user) {
        await this.users.update({ id }, editProfileInput);
        return [true, null];
      } else {
        throw new Error();
      }
    } catch (error) {
      return [
        false,
        `Account with email: ${editProfileInput.email} doesn't exist`,
      ];
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async login({
    email,
    password,
  }: LoginUserInput): Promise<[boolean, string, string?]> {
    const user = await this.users.findOne({ email });
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
}
