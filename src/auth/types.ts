import { Request } from "express"
import { AUTH_MODULE_CONSTANTS } from "./constants"
import { User } from "@prisma/client"

export type LoginInput = Pick<User, "login" | "password">
export type RegisterInput = LoginInput

export type JwtPayload = {
  id: number,
  login: string
}

export type RequestWithAuth = Request & {
  user?: User
}