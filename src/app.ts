import express from "express"
import rulesRoute from "./routes/rules/index"
import categoriesRoute from "./routes/categories/index"
import { errorHandler } from "./middlewares/errorHandler"
import { config } from "dotenv"
import cookieParser from "cookie-parser"
import session from "express-session"
import routerLogin from "./routes/login"
import cors from "cors"

config()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(
  session({
    secret: process.env.COOKIE_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
)

app.use("/api/rules", rulesRoute)
app.use("/api/auth", routerLogin)
app.use("/api/categories", categoriesRoute)

app.use(errorHandler)

export default app
