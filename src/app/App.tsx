import { observer } from "mobx-react-lite"

import { message } from "@/components/message.tsx"

import { Button } from "../components/ui/button.tsx"

const App = observer(() => {
  return (
    <>
      <Button
        onClick={() => {
          message({ content: "111", style: { height: "200px" } })
        }}
      >
        消息
      </Button>

      <Button
        onClick={() => {
          message({ content: "222", duration: 300, style: { height: "50px" } })
        }}
      >
        消息
      </Button>
    </>
  )
})

export default App
