import { useEffect } from "react"
import { observer } from "mobx-react-lite"

import { App as IApp, service } from ".."

const App = observer(() => {
  useEffect(() => {
    service({ url: "/imgs", method: "GET" })
  }, [])

  return <IApp>111</IApp>
})

export default App
