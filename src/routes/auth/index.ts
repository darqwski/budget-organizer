import { Request, Response, NextFunction, Router } from "express"
import jwt from "jsonwebtoken"
import { createHash } from "crypto"
import { getUserByUsernameAndPasswordFromDB } from "../../database/auth/auth"
import { User } from "../../model/users"
import { config } from "dotenv"
import { COOKIE_SESSION_ID_KEY } from "../../constants/cookie-keys"
import { getUserFromJWT } from "../../utils/cookies"
config()

const router = Router()

const generateJWT = (user: User) => {
  let payload = {
    user: user,
  }
  return jwt.sign(payload, process.env.JWT_KEY!, {
    expiresIn: "15m",
  })
}

router.post("/add", async (req: Request, res: Response, next: NextFunction) => {
  const user = getUserFromJWT(req)
  const { summary } = req.body
})

export default router
