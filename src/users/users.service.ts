import { LoginUserInput } from './dto/login-user.dto';
import { CreateUserInput } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { UpdateUserInput } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
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
          return [true, null, 'someFakeToken'];
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
