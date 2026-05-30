import express from "express"
import rulesRoute from "./routes/rules/index"
import { errorHandler } from "./middlewares/errorHandler"

const app = express()

app.use(express.json())

app.use("/api/rules", rulesRoute)

app.use(errorHandler)

export default app
