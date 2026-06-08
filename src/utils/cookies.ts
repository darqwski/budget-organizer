import { User } from "../model/users"
import { Request } from "express"
import jwt from "jsonwebtoken"
import { COOKIE_SESSION_ID_KEY } from "../constants/cookie-keys"

export const getUserFromRequest = (request: Request): User | null => {
  const cookie = request.cookies[COOKIE_SESSION_ID_KEY]

  if (!cookie) {
    return null
  }

  const token = jwt.decode(cookie)

  if (!token) {
    return null
  }

  //@ts-expect-error token is untyped
  return token["user"] as User
}
