import React from "react"
import ReactDOM from "react-dom/client"

import App from "./app/App.tsx"

import "./index.css"

import { withStores } from "./store"

const AppWithStore = withStores(App)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWithStore />
  </React.StrictMode>
)
