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
    return await this.usersService.createAccount(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return await this.usersService.findOne(id);
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
    return await this.usersService.login(loginUserInput);
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
    return await this.usersService.userProfile(userProfileInput);
  }

  @UseGuards(AuthGard)
  @Mutation((returns) => EditProfileOutput)
  async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return await this.usersService.editProfile(authUser.id, editProfileInput);
  }

  @Mutation((returns) => VerifyEmailOutput)
  async verifyEmail(
    @Args('input') { code }: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    return await this.usersService.verifyEmail({ code });
  }
}
