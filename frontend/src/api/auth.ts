import { http } from "./http.ts"
import { sha256 } from "../utils/sha256.ts"

export const loginUserEndpoint = async ({
  login,
  password,
}: {
  login: string
  password: string
}): Promise<string | undefined> => {
  try {
    const result = await http.post("/auth", {
      login,
      password: await sha256(password),
    })
    console.log({ result })
  } catch (exception) {
    return exception
  }
}
