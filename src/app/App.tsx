import { useEffect } from "react"
import { observer } from "mobx-react-lite"

import { message } from "@/components/message"

import { App as IApp, LoginInput, service } from ".."

const App = observer(() => {
  useEffect(() => {
    service({ url: "/imgs", method: "GET" })
  }, [])

  const info = () => {
    message({ content: "111", duration: 30 })
  }

  return (
    <IApp>
      <LoginInput />
      <button onClick={info}>111</button>
    </IApp>
  )
})

export default App
