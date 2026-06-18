import express from "express"
import rulesRoute from "./routes/rules/index"
import categoriesRoute from "./routes/categories/index"
import { errorHandler } from "./middlewares/errorHandler"
import { config } from "dotenv"
import cookieParser from "cookie-parser"
import session from "express-session"
import routerLogin from "./routes/auth"
import cors from "cors"
import routerSummaries from "./routes/summaries"
import assignmentRouter from "./routes/assignments"
import suggestAssignmentsConfigRouter from "./routes/suggest-assignments-config"

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
app.use("/api/summaries", routerSummaries)
app.use("/api/assignments", assignmentRouter)
app.use("/api/suggest-assignments-config", suggestAssignmentsConfigRouter)

app.use(errorHandler)

export default app
