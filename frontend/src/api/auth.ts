import { http } from "./http.ts"
import { sha256 } from "../utils/sha256.ts"

export const loginUserEndpoint = async ({
  login,
  password,
}: {
  login: string
  password: string
}): Promise<void> => {
  await http.post("/auth", {
    login,
    password: await sha256(password),
  })
}
