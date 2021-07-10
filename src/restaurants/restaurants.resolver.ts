import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  @Query((returns) => [Restaurant])
  restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
    return [];
  }
  @Mutation(() => Boolean)
  createRestaurant(
    @Args('createRestaurantDto') createRestaurantDto: CreateRestaurantDto,
  ): boolean {
    console.log(createRestaurantDto);
    return true;
  }
}
