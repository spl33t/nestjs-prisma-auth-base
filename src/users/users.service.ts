import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from "bcryptjs";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }
    
    async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
        return this.prisma.user.findUnique({
            where: userWhereUniqueInput,
        });

    }

    async users(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.user.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        const salt = bcrypt.genSaltSync()
        const hashPassword = bcrypt.hashSync(data.password, salt)

        return this.prisma.user.create({
            data: {
                ...data,
                password: hashPassword
            }
        });

    }

    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<User> {
        const { where, data } = params;
        return this.prisma.user.update({
            data,
            where,
        });
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
        return this.prisma.user.delete({
            where,
        });
    }

    comparePassword(user?: User | null, inputPasword?: string | null) {
        let passwordIsValid = false

        try {
            passwordIsValid = bcrypt.compareSync(
                inputPasword,
                user?.password
            )
        } catch (e) {
            throw new Error(e)
        }

        if (!passwordIsValid)
            throw new Error("Password invalid")

        return passwordIsValid
    }
}