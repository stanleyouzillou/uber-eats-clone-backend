import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { RestaurantService } from './restaurants.service';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}
  @Query((returns) => [Restaurant])
  restaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAll();
  }
  @Mutation(() => Boolean)
  async createRestaurant(
    @Args('input') createRestaurantDto: CreateRestaurantDto,
  ): Promise<boolean> {
    try {
      await this.restaurantService.createRestaurant(createRestaurantDto);
      console.log(createRestaurantDto);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  @Mutation(() => Boolean)
  async updateRestaurant(
    @Args('payload') updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<boolean> {
    try {
      const findRestaurant = await this.restaurantService.findOne(
        updateRestaurantDto.id,
      );
      if (findRestaurant) {
        console.log(updateRestaurantDto.id);
        await this.restaurantService.updateRestaurant(updateRestaurantDto);
        return true;
      } else {
        throw new Error("Restaurant doen't exist");
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
