import { User } from "../model/users"
import { Request } from "express"

export const getUserFromJWT = (request: Request): User | null => {
  const cookie = request.headers.cookie

  if (!cookie) {
    return null
  }

  return null
}
