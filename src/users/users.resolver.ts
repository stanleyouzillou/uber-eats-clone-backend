import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';

import { User } from './entities/user.entity';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { EditProfileOutput, EditProfileInput } from './dto/edit-user-profile';
import { LoginUserInput, LoginUserOutput } from './dto/login-user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserProfileInput, UserProfileOutput } from './dto/user-profile.dto';
import { VerifyEmailOutput, VerifyEmailInput } from './dto/verify-email.dto';
import { boolean } from 'joi';

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

  // @Mutation(() => User)
  // updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
  //   return this.usersService.update(updateUserInput.id, updateUserInput);
  // }

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
  @UseGuards(AuthGard)
  me(@AuthUser() user: User) {
    return user;
  }

  @Query((returns) => UserProfileOutput)
  @UseGuards(AuthGard)
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    try {
      const user = await this.usersService.findOne(userProfileInput.userId);
      if (!user) {
        throw new Error();
      }
      return {
        ok: Boolean(user),
        user,
      };
    } catch (e) {
      console.log(e);
      return {
        error: 'User not found',
        ok: false,
      };
    }
  }

  @UseGuards(AuthGard)
  @Mutation((returns) => EditProfileOutput)
  async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    const [user, ok, error] = await this.usersService.editProfile(
      authUser.id,
      editProfileInput,
    );
    try {
      return {
        user,
        ok,
        error,
      };
    } catch (error) {
      return {
        ok,
        error,
      };
    }
  }

  @Mutation((returns) => Boolean)
  async verifyEmail(@Args('input') { code }: VerifyEmailInput) {
    return await this.usersService.verifyEmail({ code });
  }
}
