import { Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { TypedBody } from "@nestia/core"
import { UsersService } from 'src/users/users.service';
import { AuthInterceptor } from './auth.interceptor';
import { LoginInput, RegisterInput } from './types';
import { CurrentUser } from './session.decorator';
import { User } from '@prisma/client';

@Controller("auth")
export class AuthController {
  constructor(
    private usersService: UsersService
  ) { }


  @UseInterceptors(AuthInterceptor)
  @Post("/login")
  async login(@TypedBody() dto: LoginInput) {
    const user = await this.usersService.user({ login: dto.login })

    this.usersService.comparePassword(user, dto.password)

    return user 
  }

  @UseInterceptors(AuthInterceptor)
  @Post("/register")
  async register(@TypedBody() dto: RegisterInput) {
    return await this.usersService.createUser(dto)
  }

  @Get("/me")
  async session(@CurrentUser() user: User) {
    return user
  }
}









