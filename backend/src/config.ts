import * as dotenv from "dotenv"
dotenv.config()

export const LISTEN_PORT = Number(process.env.LISTEN_PORT)
export const LOG_LEVEL = Number(process.env.LOG_LEVEL)
export const DB_URI = String(process.env.DB_URI)
export const DB_NAME = String(process.env.DB_NAME)