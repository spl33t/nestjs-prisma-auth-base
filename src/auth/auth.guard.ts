import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RequestWithAuth, JwtPayload } from "./types"
import { AuthController } from './auth.controller';
import { AUTH_MODULE_CONSTANTS } from './constants';
import { JwtService } from "./jwt.service"
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const routePath = context.getHandler().name as unknown as keyof AuthController
    if (routePath === "login") return true
    if (routePath === "register") return true

    const req = context.switchToHttp().getRequest() as RequestWithAuth
    const at =  req.cookies[AUTH_MODULE_CONSTANTS.ACCESS_TOKEN_KEY]

    if (!at) throw new ForbiddenException()
    const payload = await this.jwtService.verifyAccessToken(at)

    const user = await this.usersService.user({ id: payload.id })
    if (!user) throw new UnauthorizedException()

    if (Boolean(payload)) {
      req.user = user
      return true
    }

    throw new UnauthorizedException()
  }
}