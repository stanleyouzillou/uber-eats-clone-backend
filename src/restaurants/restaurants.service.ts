import { Restaurant } from './entities/restaurant.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { User } from 'src/users/entities/user.entity';
import { Category } from './entities/category.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
  ) {}
  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    const { name, bgImage, address, categoryName } = createRestaurantInput;
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput);
      newRestaurant.owner = owner;
      const lowerCategoryName = categoryName.trim().toLowerCase();
      const categoryNameSlug = lowerCategoryName.replace(/ /g, '-');
      let category = await this.categories.findOne({ slug: categoryNameSlug });
      if (!category) {
        category = await this.categories.save(
          this.categories.create({
            slug: categoryNameSlug,
            name: lowerCategoryName,
          }),
        );
      }
      await this.restaurants.save(newRestaurant);
      return {
        ok: true,
        error: null,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
