import dotenv from "dotenv"

dotenv.config()

interface Config {
  port: number
  nodeEnv: string
  dbName: string
  dbPassword: string
  dbUsername: string
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  dbName: process.env.DB_NAME || "",
  dbPassword: process.env.DB_PASSWORD || "",
  dbUsername: process.env.DB_USERNAME || "",
}

export default config
