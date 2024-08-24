import App from "@/app/App.tsx"
import { withStores } from "@/store"
import ReactDOM from "react-dom/client"

const AppWithStore = withStores(App)

ReactDOM.createRoot(document.getElementById("root")!).render(<AppWithStore />)
