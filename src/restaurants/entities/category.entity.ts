import { Restaurant } from './restaurant.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  @Length(5, 25)
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  categoryImg: string;

  //One Category may have 1 to k restaurants
  @Field((type) => [Restaurant])
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.category)
  restaurants: Restaurant[];
}
