import { Request, Response, NextFunction, Router } from "express"
import jwt from "jsonwebtoken"
import { createHash } from "crypto"
import { getUserByUsernameAndPasswordFromDB } from "../../database/auth/auth"
import { User } from "../../model/users"
import { config } from "dotenv"
import { getUserFromJWT } from "../../utils/cookies"
import { COOKIE_SESSION_ID_KEY } from "../../constants/cookie-keys"
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

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { login, password } = req.body
    const hashedPassword = createHash("sha256").update(password).digest("hex")
    const user = await getUserByUsernameAndPasswordFromDB(login, hashedPassword)

    if (!user) {
      return res.status(401).json({
        message: "Login or password is incorrect",
      })
    }

    const token = generateJWT(user)
    res.cookie(COOKIE_SESSION_ID_KEY, token, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })

    res.json({ status: "success" })
  } catch (error) {
    next(error)
  }
})

export default router
