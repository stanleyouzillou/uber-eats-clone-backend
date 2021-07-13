import { CreateRestaurantDto } from './create-restaurant.dto';
import { ArgsType, InputType, PartialType, Int, Field } from '@nestjs/graphql';

@InputType()
class UpdateRestaurantInputType extends PartialType(CreateRestaurantDto) {}

@InputType()
export class UpdateRestaurantDto {
  @Field(() => Int)
  id: number;

  @Field(() => UpdateRestaurantInputType)
  data: UpdateRestaurantInputType;
}
