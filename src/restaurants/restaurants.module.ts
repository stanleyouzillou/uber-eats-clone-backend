import { Category } from './entities/category.entity';
import { RestaurantService } from './restaurants.service';
import { Restaurant } from './entities/restaurant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantResolver } from './restaurants.resolver';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Category])],
  // define which repository is defined in the current scope
  // allow to inject RestaurantRepository into the RestaurantService using the @InjectRepository() decorator
  providers: [RestaurantResolver, RestaurantService],
})
export class RestaurantsModule {}
