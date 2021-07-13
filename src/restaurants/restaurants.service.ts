import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}
  getAll(): Promise<Restaurant[]> {
    const restaurants = this.restaurants.find();
    return restaurants;
  }
  findOne(id: number): Promise<Restaurant> {
    return this.restaurants.findOne(id);
  }
  createRestaurant(restaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const newRestaurant = this.restaurants.create(restaurantDto);
    return this.restaurants.save(newRestaurant);
  }
  updateRestaurant({ id, data }: UpdateRestaurantDto) {
    return this.restaurants.update(id, { ...data });
  }
}
