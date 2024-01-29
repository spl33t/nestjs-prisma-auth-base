import { sign, verify } from "jsonwebtoken";

import { AUTH_MODULE_CONSTANTS } from "./constants";
import { Injectable } from "@nestjs/common";
import { JwtPayload } from "./types";
import { User } from "@prisma/client";

@Injectable()
export class JwtService {
    async createAccessToken(user: User) {
        try {
            const payload: JwtPayload = { id: user.id, login: user.login };
            const at = sign(payload, AUTH_MODULE_CONSTANTS.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
            return at
        } catch (err) {
            console.log("jwtService at-sign err", err)
            throw err
        }
    }
    verifyAccessToken(token: string) {
        try {
            const decoded = verify(token, AUTH_MODULE_CONSTANTS.ACCESS_TOKEN_SECRET)
            return decoded as JwtPayload
        } catch (err) {
            console.log("jwtService at-sign err", err)
            throw err
        }
    }
}