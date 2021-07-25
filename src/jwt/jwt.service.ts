import * as jwt from 'jsonwebtoken';

import { JwtModuleOptions } from './interfaces/jwt-modules-options.interface';
import { Inject, Injectable } from '@nestjs/common';

import { CONFIG_OPTIONS } from './../common/common.constants';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}
  sign(payload: Record<'id', string | number>): string {
    return jwt.sign(payload, this.options.privateKey);
  }
  verify(token: string) {
    try {
      return jwt.verify(token, this.options.privateKey);
    } catch (error) {
      console.log(error);
    }
  }
}
