import ConfigProvider from "@/lib/configProvider.tsx"
import { observer } from "mobx-react-lite"

import { ArticleTree } from "@/components/article-tree.tsx"
import { message } from "@/components/message.tsx"

import { Button } from "../components/ui/button.tsx"

const App = observer(() => {
  return (
    <ConfigProvider articleTree={{ className: "ddd" }}>
      <div>
        <Button
          onClick={() => {
            message({ content: "111", style: { height: "200px" } })
          }}
        >
          消息
        </Button>

        <Button
          onClick={() => {
            message({
              content: "222",
              duration: 300,
              style: { height: "50px" },
            })
          }}
        >
          消息
        </Button>
        <ArticleTree
          placeholder={""}
          data={[]}
          className={"abc"}
          rootClassName={"def"}
          // prefixCls={"aaa"}
        />
      </div>
    </ConfigProvider>
  )
})

export default App
