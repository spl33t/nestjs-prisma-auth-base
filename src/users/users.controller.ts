import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypedBody } from '@nestia/core';
import { Prisma, User } from '@prisma/client';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post("/")
    createUser(
        @TypedBody() data: Prisma.UserCreateInput
    ) {
        return this.usersService.createUser(data)
    }

    @Get("/")
    users() {
        return this.usersService.users({})
    }

    @Get("/:idOrLogin")
    user(
        @Param("idOrLogin") idOrLogin: string
    ) {
        return this.usersService.user(
            (() => (Number.isInteger(+idOrLogin) ? { id: +idOrLogin } : { login: idOrLogin }))()
        )
    }

    @Delete("/:idOrLogin")
    deleteUser(
        @Param("idOrLogin") idOrLogin: string
    ) {
        return this.usersService.deleteUser(
            (() => (Number.isInteger(+idOrLogin) ? { id: +idOrLogin } : { login: idOrLogin }))()
        )
    }

    @Put("/:idOrLogin")
    updateUser(
        @TypedBody() data: Omit<Prisma.UserUpdateInput, "password">,
        @Param("idOrLogin") idOrLogin: string
    ) {
        return this.usersService.updateUser({
            data,
            where: (() => (Number.isInteger(+idOrLogin) ? { id: +idOrLogin } : { login: idOrLogin }))()
        })
    }
}
