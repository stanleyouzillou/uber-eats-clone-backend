import { CoreEntity } from './../../common/entities/core.entity';

import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import {
  InputType,
  registerEnumType,
  Field,
  ObjectType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';

import { InternalServerErrorException } from '@nestjs/common';
import { IsEmail, IsEnum } from 'class-validator';

enum UserRole {
  Client,
  Owner,
  Delivery,
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsEmail()
  email: string;

  @Column()
  @Field(() => String)
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(loginPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(loginPassword, this.password);
    } catch (e) {
      console.log(e);
    }
  }
}
