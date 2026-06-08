// TODO implement variables
const SERVER = "localhost:3000"

const overwrittenFetch = async <DataType = unknown>(
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

  const data = (await result.json()) as DataType
  if (status === 200) {
    return { data, status }
  }

  throw { data, status }
}

export const http = {
  get: <DataType = unknown>(url: string) =>
    overwrittenFetch<DataType>("GET", url),
  post: <DataType = unknown>(url: string, body?: object) =>
    overwrittenFetch<DataType>("POST", url, body),
  put: <DataType = unknown>(url: string, body?: object) =>
    overwrittenFetch<DataType>("PUT", url, body),
  delete: <DataType = unknown>(url: string, body?: object) =>
    overwrittenFetch<DataType>("DELETE", url, body),
}
