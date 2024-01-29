import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'express';
import { AUTH_MODULE_CONSTANTS } from './constants';
import { JwtService } from './jwt.service';
import { User } from '@prisma/client';
import typia from 'typia';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private jwtService: JwtService) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(async (data: User): Promise<User> => {
      const userDataIsValid = typia.validate<User>(data).success
      if (!userDataIsValid) throw new Error("class.AuthInterceptor user data invalid")

      const at = await this.jwtService.createAccessToken(data)
      if (!at) throw new Error("class.AuthInterceptor no access token")

      const res = context.switchToHttp().getResponse() as Response

      res.cookie(AUTH_MODULE_CONSTANTS.ACCESS_TOKEN_KEY, at, { httpOnly: true })

      return data
    }))
  }
}


