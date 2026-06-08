export const COOKIE_SESSION_ID_KEY = "cookie-session-session"

export const getCookieByName = (name: string): string | undefined => {
  const cookies = decodeURIComponent(document.cookie).split(";")

  console.log(cookies)
  return cookies.find((cookie) => cookie.split("=")[0] === name)
}

export const outdateCookie = (name: string): void => {
  document.cookie = `${name}=""; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
