import { useStores } from "@/store"
import { observer } from "mobx-react-lite"

import { Button } from "../components/ui/button.tsx"

const T = (props: any) => {
  return <div {...props}>111</div>
}

const App = observer(() => {
  const {
    demo: {
      state: { count },
      updateState,
    },
  } = useStores()

  return (
    <>
      <Button onClick={() => updateState({ count: count + 1 })}>{count}</Button>

      <Button asChild>
        <T />
      </Button>
    </>
  )
})

export default App
