import { useEffect } from "react"

import { Button } from "./components/ui/button"

const setFontSize = () => {
  var width = document.documentElement.clientWidth // 设置根元素字体大小。此时为宽的10等分
  // 设计尺寸 600 600/16 = 37.5
  if (width < 750) document.documentElement.style.fontSize = width / 37.5 + "px"
}

function App() {
  useEffect(() => {
    setFontSize()
    window.addEventListener("resize", setFontSize)
  }, [])

  return (
    <>
      <Button>111</Button>
    </>
  )
}

export default App
