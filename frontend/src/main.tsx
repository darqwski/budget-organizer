import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { router } from "./App.tsx"
import "./app.css"
import { RouterProvider } from "react-router/dom"
import "./i18n"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />,
  </StrictMode>
)
