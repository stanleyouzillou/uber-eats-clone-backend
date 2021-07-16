import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';

import { User } from './entities/user.entity';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { UpdateUserInput } from './dto/update-user.dto';
import { LoginUserInput, LoginUserOutput } from './dto/login-user.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => CreateUserOutput)
  async createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    try {
      const [ok, error] = await this.usersService.createAccount(
        createUserInput,
      );
      return {
        ok,
        error,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }

  @Mutation(() => LoginUserOutput)
  async login(
    @Args('input') loginUserInput: LoginUserInput,
  ): Promise<LoginUserOutput> {
    const [ok, error, token] = await this.usersService.login(loginUserInput);
    try {
      return {
        ok,
        error,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Query((returns) => User)
  me(@Context() context) {
    console.log(context);
  }
}
