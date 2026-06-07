// TODO implement variables
const SERVER = "localhost:3000"

const overwrittenFetch = async (
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  body?: object
) => {
  const result = await fetch(`http://${SERVER}/api${url}`, {
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method,
  })

  const { status } = result

  const data = await result.json()
  if (status === 200) {
    return { data, status }
  }

  throw { data, status }
}

export const http = {
  get: (url: string) => overwrittenFetch("GET", url),
  post: (url: string, body?: object) => overwrittenFetch("POST", url, body),
  put: (url: string, body?: object) => overwrittenFetch("PUT", url, body),
  delete: (url: string, body?: object) => overwrittenFetch("DELETE", url, body),
}
