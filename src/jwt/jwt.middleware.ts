import { UsersService } from 'src/users/users.service';
import { JwtService } from 'src/jwt/jwt.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      const decoded = this.jwtService.verify(token.toString());
      console.log(decoded);
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        try {
          const user = await this.usersService.findOne(decoded['id']);
          req['user'] = user;
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      console.log('not found');
    }
    next();
  }
}

// export function jwtMiddleware (req: Request, res: Response, next: NextFunction) {
//   console.log(req.headers);
//   next();
// }
