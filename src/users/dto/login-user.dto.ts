import { ObjectType, Field, InputType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class LoginUserInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginUserOutput extends MutationOutput {
  @Field(() => String, { nullable: true })
  token?: string;
}
