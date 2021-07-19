import { MutationOutput } from '../../common/dtos/output.dto';
import {
  Field,
  PartialType,
  ObjectType,
  PickType,
  InputType,
} from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ['email', 'password']),
) {}

@ObjectType()
export class EditProfileOutput extends MutationOutput {
  @Field((type) => User, { nullable: true })
  user?: User;
}
